from flask import Blueprint
from flask import current_app as app
from category.models import Nation, Religion

category_blueprint = Blueprint("category", __name__)

@category_blueprint.route("/list-nation", methods=["GET"])
def getListNation():
    return Nation().getList()


@category_blueprint.route("/list-religion", methods=["GET"])
def getListReligion():
    return Religion().getList()