from flask import current_app as app
from flask import Flask, request, jsonify
from flask.json import JSONEncoder
from bson.objectid import ObjectId
import tools
import json
import sys
import base64
import time
import numpy as np

class CustomJSONEncoder(JSONEncoder):
  def default(self, obj):
    return str(obj)


class Staff:
  def __init__(self):
    self.defaults = {

    }

  def getList(self):
    # pipeline = [
    #   {
    #     "$project": {
    #       "_id": 0,
    #       "thongtin": "$$ROOT"
    #     }
    #   }, 
    #   {
    #     "$lookup": {
    #       "localField": "thongtin._id",
    #       "from": "tbl_quatrinh_lamviec",
    #       "foreignField": "FK_iNhanvienID",
    #       "as": "quatrinhlamviec"
    #     }
    #   }, 
    #   {
    #     "$unwind": {
    #       "path": "$quatrinhlamviec",
    #       "preserveNullAndEmptyArrays": True
    #     }
    #   }, 
    #   {
    #     "$lookup": {
    #       "localField": "quatrinhlamviec.FK_iVitriCongviecID",
    #       "from": "tbl_vitri_congviec",
    #       "foreignField": "_id",
    #       "as": "vitri"
    #     }
    #   }, 
    #   {
    #     "$unwind": {
    #       "path": "$vitri",
    #       "preserveNullAndEmptyArrays": True
    #     }
    #   }
    # ]
    staff_filter = {}
    try:
      # _staffs = app.db.tbl_nhanvien.aggregate(
      #   pipeline, 
      #   allowDiskUse = True
      # )
      _staffs = app.db.tbl_nhanvien.find(staff_filter)
      arrayStaffId = []
      staffs = []
      for staff in _staffs:
        staffs.append(staff)
        arrayStaffId.append(staff['_id'])

      query = {}
      query["FK_iNhanvienID"] = { "$in": arrayStaffId }
      _work_processes = app.db.tbl_quatrinh_lamviec.find(query)
      map_work_process = {}

      for work_process in _work_processes:
        if str(work_process['FK_iNhanvienID']) not in map_work_process.keys():
          map_work_process[str(work_process['FK_iNhanvienID'])] = []
        map_work_process[str(work_process['FK_iNhanvienID'])].append(work_process)

      formatStaffs = []
      for staff in staffs:
        staff['quaTrinhLamViec'] = []
        if str(staff['_id']) in map_work_process.keys():
          staff['quaTrinhLamViec'] = map_work_process[str(staff['_id'])].copy()
          staff['congViecHienTai'] = self.getCurrentWorkProcess(map_work_process[str(staff['_id'])].copy())
        formatStaffs.append(staff)

      return jsonify(formatStaffs), 200
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify(staffs)

  def getCurrentWorkProcess(self, work_processes):
    current_work_process = work_processes.pop()
    for work_process in work_processes:
      if work_process['dNgayBatdau'] > current_work_process['dNgayBatdau']:
        current_work_process = work_process
    return current_work_process

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

      createBy = ObjectId(staff['FK_iNguoithemID'])
      if createBy:
        staff['FK_iNguoithemID'] = createBy
        staff['FK_iDantocID'] = ObjectId(staff['FK_iDantocID'])
        staff['FK_iTongiaoID'] = ObjectId(staff['FK_iTongiaoID'])
        newStaffId = app.db.tbl_nhanvien.save(staff)
        if newStaffId:
          workProcess['FK_iNhanvienID'] = newStaffId
          workProcess['FK_iNguoiChuyenID'] = createBy
          app.db.tbl_quatrinh_lamviec.save(workProcess)
        return jsonify(newStaffId), 200
      else:
        return jsonify({"message": "Người thêm không hợp lệ"}), 500
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify({"message": "Lỗi không xác định"}), 500
  
  def addStaffWorkProcess(self):
    workProcess = json.loads(request.data)
    createBy = ObjectId(workProcess['FK_iNguoiChuyenID'])

    try:
      if createBy:
        workProcess['FK_iNguoiChuyenID'] = createBy
        workProcess['FK_iNhanvienID'] = ObjectId(workProcess['FK_iNhanvienID'])
        workProcess['FK_iVitriCongviecID'] = ObjectId(workProcess['FK_iVitriCongviecID'])
        
        result = app.db.tbl_quatrinh_lamviec.save(workProcess)
        return jsonify(result), 200
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

      updateBy = ObjectId(staffUpdateData['FK_iNguoicapnhatID'])
      if updateBy:
        staffUpdateData['FK_iNguoicapnhatID'] = updateBy
        updateStaffId = app.db.tbl_nhanvien.update_one({'_id': ObjectId(staffUpdateId)}, {'$set': staffUpdateData})

        return jsonify(staffUpdateId), 200
      else:
        return jsonify({"message": "Người cập nhật không hợp lệ"}), 500
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify({"message": "Lỗi không xác định"}), 500
  
  def getStaffWorkProcess(self):
    staffId = request.args.get('nhan-vien')
    work_process_filter = {}
    work_process_filter['FK_iNhanvienID'] = ObjectId(staffId)
    try:
      _work_processes = app.db.tbl_quatrinh_lamviec.find(work_process_filter)
      work_processes = [work_process for work_process in _work_processes]
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify(work_processes)
  
  def getHoSo(self):
    profileId = request.args.get('id')
    profile_filter = {'_id': ObjectId(profileId)}
    try:
      profileData = app.db.tbl_nhanvien.find_one(profile_filter)
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify(profileData)

  def addLaborContract(self):
    data = json.loads(request.data)
    laborContract = data['newLaborContract']
    try:
      createBy = ObjectId(laborContract['FK_iNguoiLapID'])
      signedBy = ObjectId(laborContract['FK_iNguoiKyID'])

      if createBy:
        laborContract['FK_iNguoiLapID'] = createBy
        laborContract['FK_iNguoiKyID'] = signedBy
        laborContract['FK_iLoaiHopdongID'] = ObjectId(laborContract['FK_iLoaiHopdongID'])
        laborContract['FK_iQuatrinhLamviecID'] = ObjectId(laborContract['FK_iQuatrinhLamviecID'])
        if laborContract['FK_iThoihanHopdongID']:
          laborContract['FK_iThoihanHopdongID'] = ObjectId(laborContract['FK_iThoihanHopdongID'])

        laborContractAdded = app.db.tbl_hopdong_laodong.save(laborContract)
        return jsonify(laborContractAdded), 200
      else:
        return jsonify({"message": "Người thêm không hợp lệ"}), 500
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify({"message": "Lỗi không xác định"}), 500
  
  def getListLaborContract(self):
    profileId = request.args.get('id')
    pipeline = [
      {
        u"$project": {
          u"_id": 0,
          u"hd": u"$$ROOT"
        }
      }, 
      {
        u"$lookup": {
          u"localField": u"hd.FK_iQuatrinhLamviecID",
          u"from": u"tbl_quatrinh_lamviec",
          u"foreignField": u"_id",
          u"as": u"qt"
        }
      },
      {
        u"$unwind": {
          u"path": u"$qt",
          u"preserveNullAndEmptyArrays": False
        }
      },
      {
        u"$lookup": {
          u"localField": u"hd.FK_iLoaiHopdongID",
          u"from": u"dm_loaihopdong",
          u"foreignField": u"_id",
          u"as": u"lhd"
        }
      },
      {
        u"$unwind": {
          u"path": u"$lhd",
          u"preserveNullAndEmptyArrays": False
        }
      },
    ]

    try:
      _labor_contracts = app.db.tbl_hopdong_laodong.aggregate(
        pipeline, 
        allowDiskUse = True
      )
      labor_contracts = [labor_contract for labor_contract in _labor_contracts]
    except:
      print("Oops!", sys.exc_info(), "occurred.")
      return jsonify(sys.exc_info()), 500
    return jsonify(labor_contracts)