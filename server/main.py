from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from graph import Graph
from columnA import ColumnA

app = Flask(__name__)
CORS(app)


@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    colA_instance = ColumnA(file)
    computed_values_colA = colA_instance.get_values()
    
    return jsonify({'message': 'File uploaded successfully', 'data': computed_values_colA}), 200


if __name__ == "__main__":
    app.run(debug=True)
