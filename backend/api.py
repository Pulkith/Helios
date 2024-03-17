from flask import Flask, request
from flask_cors import CORS, cross_origin


app = Flask(__name__)

CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/upload', methods=['POST'])
def handle_upload():
    file = request.files['file']
    if file:
        # Save the file to the server
        file.save("/path/to/save/" + file.filename)
        return 'File uploaded successfully', 200
    return 'No file found', 400
