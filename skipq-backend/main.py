from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the model (Pretrained YOLOv8n has 80 classes including 'book', 'bottle', 'cup', etc.)
# If you train your own model, change this to "ml/models/best.pt"
model = YOLO("yolov8n.pt") 

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No image sent"}), 400

    file = request.files['image']
    
    # Convert uploaded file to an image compatible with OpenCV/YOLO
    img_bytes = file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run inference
    results = model(img)
    
    detections = []
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            name = model.names[class_id]
            conf = float(box.conf[0])
            
            # Simple filtering for "grocery-like" or "office" items in standard COCO
            # (Optional: remove this if you want to detect EVERYTHING)
            # COCO classes relevant: bottle, cup, fork, knife, spoon, bowl, banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake, chair, couch, potted plant, bed, dining table, toilet, tv, laptop, mouse, remote, keyboard, cell phone, microwave, oven, toaster, sink, refrigerator, book, clock, vase, scissors, teddy bear, hair drier, toothbrush
            
            detections.append({
                "label": name,
                "confidence": round(conf, 2),
                "box": box.xyxy[0].tolist()
            })

    return jsonify(detections)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
