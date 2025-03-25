from flask import Flask, request, send_file
from flask_cors import CORS
import torch
import onnxruntime as ort
import numpy as np
import cv2
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load YOLOv5 ONNX model
model = ort.InferenceSession("best.onnx")

def preprocess_image(file):
    # Read image
    image = Image.open(io.BytesIO(file.read()))
    original_img = np.array(image)  # Keep original image for drawing

    # Convert to RGB if not already
    if original_img.shape[-1] == 4:  # RGBA → RGB
        original_img = cv2.cvtColor(original_img, cv2.COLOR_RGBA2RGB)
    elif len(original_img.shape) == 2:  # Grayscale → RGB
        original_img = cv2.cvtColor(original_img, cv2.COLOR_GRAY2RGB)

    # Resize and normalize (match YOLOv5 preprocessing)
    img = cv2.resize(original_img, (640, 640))
    img = img.astype(np.float32) / 255.0  # Normalize
    img = np.transpose(img, (2, 0, 1))  # Convert (H, W, C) → (C, H, W)
    img = np.expand_dims(img, axis=0)  # Add batch dimension (1, C, H, W)

    return img, original_img  # Processed image + original image for visualization

def draw_boxes(image, detections, conf_threshold=0.5):
    detections = detections[0]  # Remove batch dimension (1, 25200, 8) → (25200, 8)

    for det in detections:
        x1, y1, x2, y2, conf, cls = det[:6]

        # Convert values
        x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
        conf = float(conf)
        cls = int(cls)

        # Filter out low-confidence detections
        if conf > conf_threshold:
            print(f"Drawing box: ({x1}, {y1}) → ({x2}, {y2}) | Conf: {conf:.2f} | Class: {cls}")

            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(image, f'Class {cls} ({conf:.2f})', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # 🔥 Fix color issue: Convert BGR → RGB before returning
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

@app.route("/detect", methods=["POST"])
def detect():
    file = request.files["image"]
    img, original_img = preprocess_image(file)

    # Run ONNX model inference
    outputs = model.run(None, {"images": img})
    detections = outputs[0]  # Get bounding boxes

    # Debugging: Print first 5 detections
    print("Detections Shape:", detections.shape)
    print("First 5 Detections:", detections[0][:5])

    # Ensure detections are valid
    if detections is None or detections.shape[1] < 1:
        return "No objects detected", 400

    result_img = draw_boxes(original_img, detections)

    _, img_encoded = cv2.imencode(".jpg", result_img)
    return send_file(io.BytesIO(img_encoded.tobytes()), mimetype="image/jpeg")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
