import flask
from flask import request, jsonify
from datetime import datetime
import json
from chatbot import get_response


app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return "hello"


@app.route('/message', methods=['POST'])
def meassage():
    return jsonify({
        "text": get_response(request.get_json()['text']),
        "time": datetime.now()
    })
    

app.run()
