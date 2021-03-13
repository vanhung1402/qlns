from flask import Blueprint
from flask import current_app as app
from staff.models import Staff

staff_blueprint = Blueprint("staff", __name__)


@staff_blueprint.route("/", methods=["GET"])
def get():
    return 'staff'

@staff_blueprint.route("/ho-so", methods=["POST"])
def addNew():
    return Staff().addNew()

@staff_blueprint.route("/danh-sach", methods=["GET"])
def getList():
    return Staff().getList()

