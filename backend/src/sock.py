from flask import Flask
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin

from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

from chatbot import get_response

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app, cors_allowed_origins='*')

@socketio.on('connect')
def connection():
    print('someone connected to websocket!')
    emit('responseMessage', {'data': 'Connected devices! ayy'})
    # need visibility of the global thread object
    # global thread
    # if not thread.isAlive():
    #     print("Starting Thread")
    #     thread = DataThread()
    #     thread.start()

@socketio.on('message')
def handle_message(message):
    msg = message['data']
    print('received message: ' + msg)
    message_to_send = get_response(msg)  
    print('sending response', message_to_send)
    emit('response', message_to_send)

if __name__ == '__main__':
    # socketio.run(app, host='127.0.0.1', port=5001)
    http_server = WSGIServer(('127.0.0.1',5001), app, handler_class=WebSocketHandler)
    http_server.serve_forever()


# server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  
# server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  

# server.bind(("127.0.0.1", 5001))  
# server.listen(100)  
  
# list_of_clients = []  
  

# def clientthread(conn, addr):
#     while True:  
#         try:  
#             message = conn.recv(2048)
#             if message:
#                 print('###########', message.decode())
#                 message_to_send = get_response(message.decode())
#                 print('$$$ MESSAGE RESPONSE$$$', message_to_send) 
#                 http_response = f'''HTTP/1.1
#                     Content-Type: text/plain

#                     {message_to_send}

#                     '''
#                 conn.send(http_response.encode()) 
#             else:  
#                 remove(conn)  
#         except Exception as e:  
#             print(e)
#             continue


# def remove(client):
#     if client in list_of_clients:  
#         list_of_clients.remove(client)


# while True:  
#     conn, addr = server.accept()
#     list_of_clients.append(conn)
    
#     print (addr[0] + " connected") 
#     start_new_thread(clientthread,(conn,addr))    

# conn.close()
# server.close()