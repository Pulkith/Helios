from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
import base64

import os

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/test", methods=["GET"])
def test():
    return jsonify({'message': 'Hello from Flask!'})


def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/upload', methods=['POST'])
def handle_upload():
    file = request.files['file']
    if file:
        path = '/Users/pulkith/Desktop/Development/Helios/backend'
        folder = os.path.join(path, 'uploads') # Assigns upload path to variable
        # os.makedirs(folder, exists_ok=True) # Creates the directory,
        file.save(os.path.join(folder, secure_filename("file.py")))
    #     # Save the file to the server
        # file.save("/path/to/save/" + file.filename)
        return 'File uploaded successfully', 200
    return "dummy"
    # return 'No file found', 400

@app.route('/send-file-data', methods=['GET'])
def send_file_data():
    filepath = '/Users/pulkith/Desktop/Development/Helios/backend/uploads/file.py'
    with open(filepath, 'rb') as file:
        file_data = file.read()
        encoded_data = base64.b64encode(file_data).decode('utf-8')

    return jsonify({'file_data': encoded_data})
    


from run import run_analysis

@app.route('/analyze', methods=['GET', 'POST'])
def getResponse():
    return run_analysis()



if __name__ == '__main__':
    app.run(debug=True)
