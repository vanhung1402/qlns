from flask import current_app as app
from flask import Flask, request, jsonify
from flask.json import JSONEncoder
from bson.objectid import ObjectId
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
            'from': 'tbl_quatrinh_lamviec',
            'localField': 'FK_iNhanvienID',
            'foreignField': 'PK_iNhanvienID',
            'as': 'quatrinh_lamviec',
          }
        },
        {
          '$unwind': {
            'path': "$tbl_quatrinh_lamviec",
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

      createBy = app.db.tbl_nhanvien.find_one({'PK_iNhanvienID': staff['FK_iNguoithemID']})
      if createBy:
        staff['FK_iNguoithemID'] = createBy['_id']
        newStaffId = app.db.tbl_nhanvien.save(staff)
        if newStaffId:
          workProcess['FK_iNhanvienID'] = newStaffId
          app.db.tbl_quatrinh_lamviec.save(workProcess)
        return jsonify(newStaffId), 200
      else:
        return jsonify({"message": "Người thêm không hợp lệ"}), 500
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify({"message": "Lỗi không xác định"}), 500
  
  def updateStaff(self):
    data = json.loads(request.data)
    staffUpdateId = request.args.get('id')
    staffUpdateData = data['staffData']
    
    try:
      if staffUpdateData['sDuongdanAnhdaidien']:
        avatarData = base64.b64decode(staffUpdateData['sDuongdanAnhdaidien'])
        staffUpdateData['sDuongdanAnhdaidien'] = './assets/avatar/avatar_' + \
          str(staffUpdateData['PK_iNhanvienID']) + \
          '_' + str(time.time()) + '.png'
        with open(staffUpdateData['sDuongdanAnhdaidien'], 'wb') as f:
          f.write(avatarData)

      updateBy = app.db.tbl_nhanvien.find_one({'PK_iNhanvienID': staffUpdateData['FK_iNguoicapnhatID']})
      if updateBy:
        staffUpdateData['FK_iNguoicapnhatID'] = updateBy['_id']
        updateStaffId = app.db.tbl_nhanvien.update_one({'_id': ObjectId(staffUpdateId)}, {'$set': staffUpdateData})

        return jsonify(staffUpdateId), 200
      else:
        return jsonify({"message": "Người cập nhật không hợp lệ"}), 500
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify({"message": "Lỗi không xác định"}), 500
