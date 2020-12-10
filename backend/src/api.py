import flask
from flask_cors import cross_origin
from flask import request, jsonify
from flask_socketio import SocketIO
from datetime import datetime
import json
from chatbot import init
import argparse


app = flask.Flask(__name__)
app.config["DEBUG"] = True
socketio = SocketIO(app)

@app.route('/', methods=['GET'])
def home():
    return "Web server is running."


@app.route('/message', methods=['POST'])
@cross_origin()
def meassage():
    response = jsonify({
        "text": get_response(request.get_json()['text']),
        "time": datetime.now()
    })
    return response


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--engine', type=str, default='chatterbot', help='chatterbot or chatbotrnn')
    parser.add_argument('--host', type=str, default='127.0.0.1', help='host name for web server')
    parser.add_argument('--port', type=int, default=5000, help='port number for web server')
    args = parser.parse_args()

    get_response = init(args.engine)

    app.run(host=args.host, port=args.port)
    socketio.run(app)
