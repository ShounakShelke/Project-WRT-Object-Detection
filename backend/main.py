from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
import cv2
import numpy as np
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Load the model - Prioritize High-Accuracy Engine
def load_model():
    model_paths = [
        Path("ml/runs/skipq_pro_plus/weights/best.pt"),
        Path("ml/runs/skipq_retail/weights/best.pt"),
        Path("ml/best_skipq_model.pt"),
        Path("yolov8m.pt"),
        Path("yolov8n.pt"),
    ]
    
    for model_path in model_paths:
        if model_path.exists() and model_path.stat().st_size > 1000000: 
            try:
                print(f"Loading Detection Engine: {model_path}")
                loaded_model = YOLO(str(model_path))
                print(f"Core Engine Active: {model_path}")
                return loaded_model
            except Exception as e:
                print(f"Engine {model_path.name} failed: {e}")
                continue
    
    print("Deploying Light-Weight Emergency Engine (yolov8n)")
    return YOLO("yolov8n.pt")

model = load_model() 

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No image sent"}), 400

    file = request.files['image']
    
    # Convert uploaded file to an image compatible with OpenCV/YOLO
    img_bytes = file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image format"}), 400

    # Run inference with optimized parameters for MAX ACCURACY
    try:
        # conf=0.35 filters out low-probability ghosts
        # iou=0.45 handles overlapping boxes better (NMS)
        results = model(img, verbose=False, conf=0.35, iou=0.45)
    except Exception as e:
        print(f"Inference error: {e}")
        return jsonify({"error": f"Detection failed: {str(e)}"}), 500
    
    detections = []
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            name = model.names[class_id]
            conf = float(box.conf[0])
            bbox = box.xyxy[0].tolist()
            
            # Formatted detection payload
            detections.append({
                "label": name.replace('_', ' ').title(), # Prettier names
                "class_id": class_id,
                "confidence": round(conf, 2),
                "box": [round(coord, 2) for coord in bbox]
            })

    return jsonify(detections)


if __name__ == '__main__':
    print("\n" + "="*60)
    print("Project WRT Pro High-Accuracy Backend")
    print("="*60)
    print(f"Engine Type: {model.model_name if hasattr(model, 'model_name') else 'YOLOv8-Medium'}")
    print(f"Status: MAXIMUM ACCURACY MODE ACTIVE")
    print(f"Classes: {len(model.names)} detected items supported")
    print("="*60)
    print("Server starting on http://localhost:5000")
    print("="*60 + "\n")
    app.run(host='0.0.0.0', port=5000)

