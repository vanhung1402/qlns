import os
from flask import Flask, redirect, url_for, request, render_template, jsonify
from pymongo import MongoClient

app = Flask("DockerTutorial")

client = MongoClient('mongodb://db:27017/')
db = client.doantuyendung

@app.route("/")
def index():
    _items = db.jobposition.find()
    items = [items for items in _items]

    return jsonify(items)


@app.route("/new", methods=["POST"])
def new():
    data = {
        "helloworld": request.form["helloworld"]
    }

    db.appdb.insert_one(data)

    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

