import flask
from flask_cors import cross_origin
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
@cross_origin()
def meassage():
    response = jsonify({
        "text": get_response(request.get_json()['text']),
        "time": datetime.now()
    })
    return response


app.run(host='0.0.0.0')
