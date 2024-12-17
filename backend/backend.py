from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Hugging Face API Configuration
API_URL = "https://huggingface.co/Adarsh-12/flan-t5-small-finetuned"  # Replace with your model's URL
HEADERS = {"Authorization": "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"}  # Replace with your Hugging Face API key

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = data.get('input', '')

    if not user_input:
        return jsonify({"error": "Input text is missing"}), 400

    response = requests.post(API_URL, headers=HEADERS, json={"inputs": user_input})

    if response.status_code != 200:
        return jsonify({"error": "Hugging Face API error", "details": response.text}), response.status_code

    return jsonify(response.json())

if __name__ == '__main__':
    app.run(port=5000, debug=True)
