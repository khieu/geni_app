import flask
from flask_cors import cross_origin
from flask import request, jsonify
from flask_socketio import SocketIO
from datetime import datetime
import json
from chatbot import get_response


app = flask.Flask(__name__)
app.config["DEBUG"] = True
socketio = SocketIO(app)

@app.route('/', methods=['GET'])
def home():
    return "hello"


@app.route('/message', methods=['POST'])
@cross_origin()
def meassage():
    response = jsonify({
        "text": get_response(request.get_json()['text']),
        "time": datetime.now()
    })
    return response


@socketio.on('message')
def handle_message(msg):
    print(msg)


if __name__ == "__main__":
    app.run(host='127.0.0.1')
    socketio.run(app)
