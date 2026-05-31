import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Load the model from the current directory
MODEL_PATH = "plant_disease_model.h5"
try:
    print(f"Loading model from {MODEL_PATH}...")
    model = load_model(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

class_names = [
    'American Bollworm on Cotton', 'Anthracnose on Cotton', 'Army worm',
    'Becterial Blight in Rice', 'Brownspot', 'Common_Rust',
    'Cotton Aphid', 'Flag Smut', 'Gray_Leaf_Spot', 'Healthy Maize',
    'Healthy Wheat', 'Healthy cotton', 'Leaf Curl', 'Leaf smut',
    'Mosaic sugarcane', 'RedRot sugarcane', 'RedRust sugarcane',
    'Rice Blast', 'Sugarcane Healthy', 'Tungro',
    'Wheat Brown leaf Rust', 'Wheat Stem fly', 'Wheat aphid',
    'Wheat black rust', 'Wheat leaf blight', 'Wheat mite',
    'Wheat powdery mildew', 'Wheat scab', 'Wheat___Yellow_Rust',
    'Wilt', 'Yellow Rust Sugarcane', 'bacterial_blight in Cotton',
    'bollrot on Cotton', 'bollworm on Cotton', 'cotton mealy bug',
    'cotton whitefly', 'maize ear rot', 'maize fall armyworm',
    'maize stem borer', 'pink bollworm in cotton',
    'red cotton bug', 'thirps on cotton'
]

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/scan', methods=['POST'])
def scan_crop():
    if model is None:
        return jsonify({'error': 'ML Model is not loaded. Check server logs.'}), 500

    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Preprocess the image
            img = image.load_img(filepath, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = img_array / 255.0
            
            # Predict
            predictions = model.predict(img_array)
            predicted_index = np.argmax(predictions)
            confidence = float(np.max(predictions)) * 100 # percentage
            
            predicted_class = class_names[predicted_index]
            
            # Clean up the saved file
            os.remove(filepath)
            
            return jsonify({
                'prediction': predicted_class,
                'confidence': confidence,
                'status': 'success'
            })
            
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Service on port 5001...")
    app.run(debug=True, port=5001)
