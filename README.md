# xrayai

## Instructions

### Reference: https://github.com/mtobeiyf/keras-flask-deploy-webapp

- Clone the repo
- Install requirements.txt
- Install tensorflow-model-server
```
sudo echo "deb http://storage.googleapis.com/tensorflow-serving-apt stable tensorflow-model-server tensorflow-model-server-universal" | sudo tee /etc/apt/sources.list.d/tensorflow-serving.list && \
curl https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg | sudo apt-key add -

sudo apt-get update
sudo apt-get install tensorflow-model-server
tensorflow_model_server --version TensorFlow ModelServer: 2.0.0+dev.sha.b5a11f1 TensorFlow Library: 2.0.0
``` 

Use the following command as an alternative install for tensorflow-model-server
```
echo "deb http://storage.googleapis.com/tensorflow-serving-apt stable tensorflow-model-server tensorflow-model-server-universal" | tee /etc/apt/sources.list.d/tensorflow-serving.list && curl https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg | apt-key add -
apt update
apt-get install tensorflow-model-server
```

- Start tensorflow-model-server
```
tensorflow_model_server --model_base_path=[Path_to_the_repo]/xrayai-server/classifier --rest_api_port=9000 --model_name=xrayai
e.g. 
tensorflow_model_server --model_base_path=/home/user/Desktop/OMSCS/DVA/xrayai-server/classifier --rest_api_port=9000 --model_name=xrayai
``` 
- Ensure that the tensorflow_model_server is running at: http://localhost:9000/v1/models/xrayai:predict
- Start the app with:
``` 
python app.py
``` 
- Check [http://localhost:5000](http://localhost:5000/)

## SystemD Service Files
The following are examples of systemd service files to ensure we can run the X-Ray AI in a production enviornment that starts on boot and restarts if it exits due to an error or any other reason.
We place the files into /lib/systemd/system/ or your standard directory for systemd *.service files.

Please note that you will need to customize the paths in these files. After creating them and placing them in the right directory, run the following commands for setup in systemd as root.
```
systemctl start xrayaipython
systemctl start xrayaitensorflow
systemctl enable xrayaipython
systemctl enable xrayaitensorflow
```

## Demo
![Demo](https://raw.githubusercontent.com/xinlutu2/xrayai-server/master/img/demo.png)

`xrayaipython.service`
```
[Unit]
Description=Runs the Python Flask API

[Service]
Type=simple
ExecStart=/opt/bitnami/python/bin/python /home/husmani/xrayai-server/app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

`xrayaitensorflow.service`
```
[Unit]
Description=Run the Chest X-Ray artificial intelligence created through tensorflow and hosted using tensorflow server

[Service]
Type=simple
Restart=always
ExecStart=/opt/bitnami/tensorflow-serving/bazel-bin/tensorflow_serving/model_servers/tensorflow_model_server --model_base_path=/home/husmani/xrayai-server/classifier --rest_api_port=9000 --model_name=xrayai

[Install]
WantedBy=multi-user.target
```
