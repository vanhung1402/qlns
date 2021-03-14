from flask import current_app as app
from flask import Flask, request, jsonify
from flask.json import JSONEncoder
import tools
import json

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        return str(obj)


class Nation:
    def __init__(self):
        self.defaults = {

        }

    def getList(self):
        _nations = app.db.dm_dantoc.find({})
        nations = [nation for nation in _nations]
        return jsonify(nations)

class Religion:
    def __init__(self):
        self.defaults = {

        }

    def getList(self):
        _religions = app.db.dm_tongiao.find({})
        religions = [religion for religion in _religions]
        return jsonify(religions)