from flask import Blueprint
from flask import current_app as app
from staff.models import Staff

staff_blueprint = Blueprint("staff", __name__)


@staff_blueprint.route("/", methods=["GET"])
def get():
    return 'staff'

@staff_blueprint.route("/ho-so", methods=["GET"])
def getHoSo():
    return Staff().getHoSo()

@staff_blueprint.route("/ho-so", methods=["POST"])
def addNew():
    return Staff().addNew()

@staff_blueprint.route("/ho-so", methods=["PUT"])
def updateStaff():
    return Staff().updateStaff()

@staff_blueprint.route("/danh-sach", methods=["GET"])
def getList():
    return Staff().getList()

@staff_blueprint.route("/qua-trinh-lam-viec", methods=["GET"])
def getStaffWorkProcess():
    return Staff().getStaffWorkProcess()


