from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Allow React app to access this API

# Load model
model = tf.keras.models.load_model('./model/acne_classifier_model.h5')
classes = ['Blackheads', 'Cyst', 'Papules', 'Pustules', 'Whiteheads']

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image'].read()
    input_tensor = preprocess_image(image)
    prediction = model.predict(input_tensor)
    predicted_class = classes[np.argmax(prediction)]
    confidence = float(np.max(prediction))

    return jsonify({
        'class': predicted_class,
        'confidence': f"{confidence:.2f}"
    })

if __name__ == '__main__':
    app.run(debug=True)
