import awsgi
from flask import Flask, request, jsonify
from flask_cors import CORS
from column_ab import ColumnAB
from column_cd import ColumnCD
from column_f import ColumnF

app = Flask(__name__)
CORS(app)


def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    return file


@app.route("/degree_based", methods=["POST"])
def degree_based():
    file = upload_file()
    colAB_instance = ColumnAB(file)
    colCD_instance = ColumnCD(file)
    ab_values = colAB_instance.get_ab_values()
    cd_values = colCD_instance.get_values()
    graph_plot = colAB_instance.get_graph_plot()
    edge_count = colAB_instance.get_edge_count()
    vertices_count = colAB_instance.get_vertices_count()
    return jsonify({'message': 'File uploaded successfully',
                    'data':
                        {"four_columns": {**ab_values, **cd_values},
                         "graph": graph_plot,
                         "edgeCount": edge_count,
                         "verticesCount": vertices_count
                         }
                    }

                   ), 200


@app.route("/distance_based", methods=["POST"])
def distance_based():
    file = upload_file()
    colF_instance = ColumnF(file)

    distance_entropies = colF_instance.get_distance_entropies()
    distance_indices = colF_instance.get_distance_indices()
    graph_plot = colF_instance.get_graph_plot()
    edge_count = colF_instance.get_edge_count()
    vertices_count = colF_instance.get_vertices_count()
    return jsonify({'message': 'File uploaded successfully',
                    'data':
                        {
                            "Distance Indices": distance_indices,
                            "Distance Entropies": distance_entropies,
                            "graph": graph_plot,
                            "edgeCount": edge_count,
                            "verticesCount": vertices_count
                        }
                    }

                   ), 200


def lambda_handler(event, context):
    return awsgi.response(app, event, context, base64_content_types={"image/png"})


if __name__ == "__main__":
    app.run(debug=True)
