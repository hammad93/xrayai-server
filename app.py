from __future__ import division, print_function
# coding=utf-8
import sys
import os
import glob
import re
import numpy as np

import requests
import json
import statistics
from keras.preprocessing import image

# Flask utils
from flask import Flask, redirect, url_for, request, render_template, jsonify
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

# Define a flask app
app = Flask(__name__)
print('Starting tensorflow_model_server on http://localhost:9000/v1/models/xrayai:predict')
print('Starting application on http://localhost:5000/')

def process_image(img_path):
    img = image.load_img(img_path, target_size=(128, 128), grayscale=True) #target_size must agree with what the trained model expects!!

    # Preprocessing the image
    img = image.img_to_array(img) / 255
    img = np.expand_dims(img, axis=0)

    return img

def model_predict(img_list):
    raw = {"signature_name": "serving_default"}
    raw["instances"] = img_list
    data = json.dumps(raw)

    headers = {"content-type": "application/json"}
    # json_response = requests.post('http://34.73.20.177:9000/v1/models/xrayai:predict', data=data, headers=headers)
    json_response = requests.post('http://localhost:9000/v1/models/xrayai:predict', data=data, headers=headers)
    labels = ['Atelectasis','Cardiomegaly','Consolidation','Edema','Effusion','Emphysema','Fibrosis','Infiltration','Mass','Nodule','Pleural_Thickening','Pneumonia','Pneumothorax']
    res = {}
    res["predictions"] = []

    for prediction in json.loads(json_response.text)["predictions"]:
        # percentage = ["{0:.2f}%".format(val*100) for val in prediction]
        percentage = [round(val*100,2) for val in prediction]
        percentage_label = dict(zip(labels, percentage))
        res["predictions"].append(percentage_label)

    return res


@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['image']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # Make prediction
        new_image = process_image(file_path).tolist()
        preds = model_predict(new_image)['predictions'][0]
        preds = {k: preds[k] for k in sorted(preds, key=preds.get, reverse=True)}
        labels = list(preds.keys())
        values = list(preds.values())

        preds["data"] = {}
        preds["data"]["labels"] = labels
        preds["data"]["chartData"] = values
        print(preds)
        return jsonify(preds)
    return None


if __name__ == '__main__':
    # app.run(port=5002, debug=True)

    # Serve the app with gevent
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()
