from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from graph import Graph
from column_ab import ColumnAB
from column_cd import ColumnCD
from column_e import ColumnE
from column_f import ColumnF

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
    colE_instance = ColumnE(file)
    colF_instance = ColumnF(file)
    # ab_values = colAB_instance.get_ab_values()
    computed_values_colCD = colCD_instance.get_values()
    # distance_indices = colE_instance.get_distance_indices()

    distance_entropies = colF_instance.get_distance_entropies()
    distance_indices = colF_instance.get_distance_indices()
    ab_values = colF_instance.get_ab_values()
    return jsonify({'message': 'File uploaded successfully',
                    'data':
                        {"four_columns": {**ab_values, **computed_values_colCD},
                         "distance_columns": {**distance_indices, **distance_entropies}
                         }
                    }
                   ), 200


if __name__ == "__main__":
    app.run(debug=True)
