# xrayai

## Instructions

- Clone the repo
- Install requirements.txt
- Install tensorflow-model-server
```
echo "deb [arch=amd64] [http://storage.googleapis.com/tensorflow-serving-apt](http://storage.googleapis.com/tensorflow-serving-apt) stable tensorflow-model-server tensorflow-model-server-universal" | sudo tee /etc/apt/sources.list.d/tensorflow-serving.list && curl [https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg](https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg) | sudo apt-key add -
sudo apt-get update
sudo apt-get install tensorflow-model-server
tensorflow_model_server --version TensorFlow ModelServer: 2.0.0+dev.sha.b5a11f1 TensorFlow Library: 2.0.0
``` 
- Start tensorflow-model-server
```
tensorflow_model_server --model_base_path=[Path_to_the_repo]/xrayai-server/classifer --rest_api_port=9000 --model_name=xrayai
e.g. 
tensorflow_model_server --model_base_path=/home/user/Desktop/OMSCS/DVA/xrayai-server/classifer --rest_api_port=9000 --model_name=xrayai
``` 
- Ensure that the tensorflow_model_server is running at: http://localhost:9000/v1/models/xrayai:predict
- Start the app with:
``` python app.py
``` 
- Check [http://localhost:5000](http://localhost:5000/)