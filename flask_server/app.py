import json
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    app.run()

# @app.route('/imageclassifier/predict/', methods=['POST'])
# def image_classifier():
