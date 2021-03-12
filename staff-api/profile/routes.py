from flask import Blueprint
from flask import current_app as app
from profile.models import Profile

profile_blueprint = Blueprint("profile", __name__)


@profile_blueprint.route("/", methods=["GET"])
def get():
    return 'Profile'


@profile_blueprint.route("/list", methods=["GET"])
def getList():
    return Profile().getList()


@profile_blueprint.route("/info", methods=["GET"])
def getProfile():
    return Profile().getProfile()
