import requests
import json
import statistics
from keras.preprocessing import image
import numpy as np

def process_image(img_path):
    img = image.load_img(img_path, target_size=(128, 128), grayscale=True) #target_size must agree with what the trained model expects!!

    # Preprocessing the image
    img = image.img_to_array(img) / 255
    img = np.expand_dims(img, axis=0)

    return img

new_image = process_image("/home/user/Desktop/OMSCS/DVA/xrayai-server/test_images/00000017_001.png").tolist()
raw = {"signature_name": "serving_default"}
raw["instances"] = new_image
data = json.dumps(raw)
# print(data)

headers = {"content-type": "application/json"}
json_response = requests.post('http://localhost:9000/v1/models/xrayai:predict', data=data, headers=headers)
labels = ['Atelectasis','Cardiomegaly','Consolidation','Edema','Effusion','Emphysema','Fibrosis','Infiltration','Mass','Nodule','Pleural_Thickening','Pneumonia','Pneumothorax']
res = {}
res["predictions"] = []

for prediction in json.loads(json_response.text)["predictions"]:
	percentage = ["{0:.2f}%".format(val*100) for val in prediction]
	percentage_label = dict(zip(labels, percentage))
	res["predictions"].append(percentage_label)

print(res)