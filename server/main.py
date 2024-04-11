from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from graph import Graph
from column_ab import ColumnAB
from column_cd import ColumnCD

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
    colAB_instance = ColumnAB(file)
    colCD_instance = ColumnCD(file)
    computed_values_colAB = colAB_instance.get_values()
    computed_values_colCD = colCD_instance.get_values()
    return jsonify({'message': 'File uploaded successfully', 'data': {**computed_values_colAB, **computed_values_colCD}}), 200


if __name__ == "__main__":
    app.run(debug=True)
