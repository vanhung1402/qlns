from flask import current_app as app
from flask import Flask, request, jsonify
from flask.json import JSONEncoder
import tools
import json

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        return str(obj)


class Profile:
    def __init__(self):
        self.defaults = {

        }

    def getList(self):
        _accounts = app.db.Account.find({})
        accounts = [account for account in _accounts]
        return jsonify(accounts)

    def getProfile(self):
        if request.form.get('id'):
            id = request.form.get('id')
        else:
            id = request.args.get('id')
        return jsonify(id)
