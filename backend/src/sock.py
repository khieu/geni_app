from flask import Flask, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin
import argparse
from chatbot import init

from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app, cors_allowed_origins='*')

@socketio.on('connect')
def connection():
    print('someone connected to websocket!')
    emit('connected', {'data': 'Connected devices! ayy'})

@socketio.on('message')
def handle_message(message):
    msg = message['text']
    print('received message: ' + msg)
    message_to_send = get_response(msg)  
    print('sending response', message_to_send)
    emit('response', {'text': message_to_send, 'sent_time': message['time']})

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--engine', type=str, default='chatterbot', help='chatterbot or chatbotrnn')
    parser.add_argument('--host', type=str, default='127.0.0.1', help='host name for web server')
    parser.add_argument('--port', type=int, default=5000, help='port number for web server')
    args = parser.parse_args()
    get_response = init(args.engine)
    http_server = WSGIServer((args.host, args.port), app, handler_class=WebSocketHandler)
    print("WebSocket launched.")
    http_server.serve_forever()