from flask import current_app as app
from flask import Flask, request, jsonify
from flask.json import JSONEncoder
import tools
import json
import sys
import base64
import time


class CustomJSONEncoder(JSONEncoder):
  def default(self, obj):
    return str(obj)


class Staff:
  def __init__(self):
    self.defaults = {

    }

  def getList(self):
    try:
      _staffs = app.db.tbl_nhanvien.aggregate([
        {
          '$lookup': {
            'from': 'WorkProcess',
            'localField': 'FK_iNhanvienID',
            'foreignField': 'PK_iNhanvienID',
            'as': 'WorkProcess',
          }
        },
        {
          '$unwind': {
            'path': "$WorkProcess",
            'preserveNullAndEmptyArrays': True
          }
        },
      ])
      staffs = [staff for staff in _staffs]
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify(staffs)

  def getStaff(self, iNhanvienID):
    staff = app.db.tbl_nhanvien.find_one({'PK_iNhanvienID': iNhanvienID})
    return staff

  def addNew(self):
    data = json.loads(request.data)
    staff = data['staffData']
    workProcess = data['staffWorkProcess']

    try:
      if staff['sDuongdanAnhdaidien']:
        avatarData = base64.b64decode(staff['sDuongdanAnhdaidien'])
        staff['sDuongdanAnhdaidien'] = './assets/avatar/avatar_' + \
          str(staff['PK_iNhanvienID']) + \
          '_' + str(time.time()) + '.png'
        with open(staff['sDuongdanAnhdaidien'], 'wb') as f:
          f.write(avatarData)

      newStaffId = app.db.tbl_nhanvien.save(staff)
      if newStaffId:
        workProcess['FK_iNhanvienID'] = newStaffId
        app.db.WorkProcess.save(workProcess)
      return jsonify(newStaffId), 200
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify({"message": "Lỗi không xác định"}), 500
