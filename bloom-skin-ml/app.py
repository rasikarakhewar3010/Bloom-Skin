# ==============================================================================
# Skin Problem Classification API - app.py (ML Service)
# ==============================================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import cv2
from mtcnn.mtcnn import MTCNN
import os

# --- 1. CONFIGURATION & INITIALIZATION ---
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}})

MODEL_PATH = './model/skin_problem_classifier_v1.h5'
CONFIDENCE_THRESHOLD = 0.80

CLASS_LABELS = ['Blackheads', 'Cyst', 'Papules', 'Pustules', 'Whiteheads']

TREATMENT_INFO = {
    'Blackheads': {'info': 'Blackheads are open comedones caused by clogged hair follicles...'},
    'Cyst': {'info': 'Cystic acne is a severe, painful form located deep within the skin...'},
    'Papules': {'info': 'Papules are small, red, tender bumps with no head...'},
    'Pustules': {'info': 'Pustules are what many call pimples—red, inflamed bumps...'},
    'Whiteheads': {'info': 'Whiteheads are closed comedones...'},
    'Clear Skin': {'info': 'Our analysis did not find strong evidence of a skin problem...'},
    'Invalid Image': {'info': 'We could not detect a clear face or process the image...'}
}

# --- 2. LOAD MODELS ON STARTUP ---
model = None
face_detector = None

try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        face_detector = MTCNN()
        print("✅ Model and face detector loaded successfully.")
    else:
        print(f"❌ Model not found at path: {MODEL_PATH}")
except Exception as e:
    print(f"❌ Failed to load model or detector: {e}")

# --- 3. CORE LOGIC: IMAGE ANALYSIS ---
def analyze_skin_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img_rgb = np.array(img)
    except Exception:
        return {
            'class': 'Invalid Image',
            'confidence': 1.0,
            'info': TREATMENT_INFO['Invalid Image']['info']
        }, 400

    detections = face_detector.detect_faces(img_rgb)
    image_to_process = img_rgb

    if detections:
        print("✅ Face detected. Cropping...")
        x, y, width, height = detections[0]['box']
        x1, y1 = max(0, x - 20), max(0, y - 20)
        x2, y2 = min(img_rgb.shape[1], x + width + 20), min(img_rgb.shape[0], y + height + 20)
        image_to_process = img_rgb[y1:y2, x1:x2]
    else:
        print("⚠️ No face detected. Using full image.")

    try:
        resized_image = cv2.resize(image_to_process, (224, 224))
        img_array = resized_image / 255.0
        input_tensor = np.expand_dims(img_array, axis=0)

        prediction = model.predict(input_tensor)
        confidence = float(np.max(prediction))
        class_index = np.argmax(prediction)

        predicted_class = CLASS_LABELS[class_index] if confidence >= CONFIDENCE_THRESHOLD else "Clear Skin"

        return {
            'class': predicted_class,
            'confidence': confidence,
            'info': TREATMENT_INFO[predicted_class]['info']
        }, 200
    except Exception as e:
        print(f"❌ Image processing failed: {e}")
        return {
            'class': 'Invalid Image',
            'confidence': 0.0,
            'info': 'Something went wrong while analyzing the image.'
        }, 500

# --- 4. API ROUTES ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None or face_detector is None:
        return jsonify({'error': 'Model or face detector not loaded.'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded in the request.'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty file submitted.'}), 400

    try:
        image_bytes = file.read()
        result, status = analyze_skin_image(image_bytes)
        return jsonify(result), status
    except Exception as e:
        print(f"❌ Error during /predict request: {e}")
        return jsonify({'error': 'Internal server error.'}), 500

# --- 5. RUN APP ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
