import os

from flask import Flask, redirect, url_for, request, render_template, jsonify
from pymongo import MongoClient
from bson import json_util
from flask.json import JSONEncoder

from profile.routes import profile_blueprint

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        return str(obj)

app = Flask(__name__)
client = MongoClient(os.environ['MONGO_URL'])
app.db = client.qlns
app.json_encoder = CustomJSONEncoder

app.register_blueprint(profile_blueprint, url_prefix="/profile")

@app.route('/')
def todo():
    _items = app.db.Account.find()
    items = [item for item in _items]
    print(items)
    return jsonify(items)


@app.route('/new', methods=['POST'])
def new():

    item_doc = {
        'name': request.form['name'],
        'description': request.form['description']
    }
    db.tododb.insert_one(item_doc)

    return redirect(url_for('todo'))

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
