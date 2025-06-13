from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# --- Configuration ---
app = Flask(__name__)
# CORS is not strictly needed in our proxy setup, but it doesn't hurt.
# The browser only talks to the Node.js server, which handles CORS.
CORS(app)  

# --- Load Model and Define Classes ---
try:
    # Load your trained acne classification model
    model = tf.keras.models.load_model('./model/acne_classifier_model.h5')
    # Acne class names MUST match the order your model was trained on
    classes = ['Blackheads', 'Cyst', 'Papules', 'Pustules', 'Whiteheads']
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None # Set model to None if loading fails

# Confidence threshold: if max prediction is below this, classify as "Unknown"
CONFIDENCE_THRESHOLD = 0.60 

# --- Image Preprocessing Function ---
def preprocess_image(image_bytes):
    """
    Takes image bytes, opens, resizes, and normalizes the image
    to the format the model expects.
    """
    try:
        # Open the image from byte stream and ensure it's in RGB format
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        # Resize to the model's expected input size (e.g., 224x224)
        img = img.resize((224, 224))
        # Convert image to a numpy array and normalize pixel values to [0, 1]
        img_array = np.array(img) / 255.0
        # Add a batch dimension (e.g., from (224, 224, 3) to (1, 224, 224, 3))
        return np.expand_dims(img_array, axis=0)
    except Exception as e:
        # If any error occurs during preprocessing (e.g., corrupt file)
        print(f"Error preprocessing image: {e}")
        return None

# --- API Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    # Immediately check if the model was loaded correctly on startup
    if model is None:
        return jsonify({'error': 'Model is not available. Please check server logs.'}), 503 # 503 Service Unavailable

    # 1. Validate the incoming request
    # Check if the 'image' key is in the files part of the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found in the request. The key must be "image".'}), 400

    file = request.files['image']

    # Check if a file was actually selected
    if file.filename == '':
        return jsonify({'error': 'No file selected.'}), 400
    
    # 2. Read and Preprocess the Image
    # Read the file's content into bytes
    image_bytes = file.read()
    input_tensor = preprocess_image(image_bytes)

    # If preprocessing fails, it returns None
    if input_tensor is None:
        return jsonify({'error': 'Invalid or corrupt image file. Please try another.'}), 400

    # 3. Make Prediction
    try:
        prediction = model.predict(input_tensor)
        
        # Get the highest confidence score and the index of the predicted class
        confidence = float(np.max(prediction))
        predicted_index = np.argmax(prediction)

        # 4. Handle Low Confidence
        # If the model is not confident enough, we return a successful response
        # but with a special class 'Unknown' for the frontend to handle.
        if confidence < CONFIDENCE_THRESHOLD:
            print(f"Low confidence prediction ({confidence:.2f}). Returning 'Unknown'.")
            return jsonify({
                'class': 'Unknown',
                'confidence': confidence # CRITICAL: Return as a number
            })

        # 5. Format and Return Successful Prediction
        predicted_class = classes[predicted_index]
        print(f"Prediction successful: {predicted_class} with confidence {confidence:.2f}")

        return jsonify({
            'class': predicted_class,
            'confidence': confidence # CRITICAL: Return as a number, not a string
        })

    except Exception as e:
        print(f"❌ Error during model prediction: {e}")
        return jsonify({'error': 'An internal error occurred during prediction.'}), 500


# --- Run the App ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)