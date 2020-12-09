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

@socketio.on('message')
def handle_message(message):
    msg = message['data']
    print('received message: ' + msg)
    message_to_send = get_response(msg)  
    print('sending response', message_to_send)
    emit('response', message_to_send)

if __name__ == '__main__':
    http_server = WSGIServer(('127.0.0.1',5001), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
