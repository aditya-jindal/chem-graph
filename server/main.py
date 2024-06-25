import awsgi
from flask import Flask, request, jsonify
from flask_cors import CORS
from column_ab import ColumnAB
from column_cd import ColumnCD
from column_f import ColumnF
from basic_values import BasicValues

app = Flask(__name__)
CORS(app)


def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    return file


@app.route("/", methods=["GET"])
def hello_world():
    return "Hello World"


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
                        {"four_columns": {**ab_values, **cd_values}}
                    }
                   ), 200


@app.route("/distance_based", methods=["POST"])
def distance_based():
    file = upload_file()
    colF_instance = ColumnF(file)

    distance_entropies = colF_instance.get_distance_entropies()
    distance_indices = colF_instance.get_distance_indices()
    edge_count = colF_instance.get_edge_count()
    vertices_count = colF_instance.get_vertices_count()
    return jsonify({'message': 'File uploaded successfully',
                    'data':
                        {
                            "Distance Indices": distance_indices,
                            "Distance Entropies": distance_entropies,
                        }
                    }
                   ), 200


@app.route("/edge_partitions", methods=["POST"])
def edge_partitions():
    file = upload_file()
    basic_values = BasicValues(file)
    edge_count = basic_values.get_edge_count()
    vertices_count = basic_values.get_vertices_count()
    edge_list = basic_values.get_edge_list()
    return jsonify({'message': 'File uploaded successfully',
                    'data':
                        {
                            "Edge Count": edge_count,
                            "Vertices Count": vertices_count,
                            "Edge List": edge_list
                        }
                    }
                   ), 200


def lambda_handler(event, context):
    print("og event:", event)
    event["httpMethod"] = event.get("requestContext").get("http").get("method")
    event["path"] = event.get("requestContext").get("http").get("path")
    event['queryStringParameters'] = {}
    awsgi_response = awsgi.response(
        app, event, context, base64_content_types={"image/png"})
    del awsgi_response["headers"]["Access-Control-Allow-Origin"]
    awsgi_response["headers"]["Access-Control-Allow-Credentials"] = True

    return awsgi_response


if __name__ == "__main__":
    app.run(debug=True)
