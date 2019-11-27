xrayai

$ echo "deb [arch=amd64] http://storage.googleapis.com/tensorflow-serving-apt stable tensorflow-model-server tensorflow-model-server-universal" | sudo tee /etc/apt/sources.list.d/tensorflow-serving.list && curl https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg | sudo apt-key add -
$ sudo apt-get update
$ sudo apt-get install tensorflow-model-server
$ tensorflow_model_server --version
TensorFlow ModelServer: 2.0.0+dev.sha.b5a11f1
TensorFlow Library: 2.0.0

$ tensorflow_model_server --model_base_path=/home/user/Desktop/OMSCS/DVA/xrayai-server/classifer --rest_api_port=9000 --model_name=xrayai
# tensorflow_model_server --model_base_path=[Path_to_xrayai-server]/xrayai-server/classifer --rest_api_port=9000 --model_name=xrayai

http://localhost:9000/v1/models/xrayai:predict