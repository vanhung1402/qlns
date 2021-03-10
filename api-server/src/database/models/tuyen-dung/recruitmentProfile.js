import mongoose from 'mongoose'
const Schema = mongoose.Schema

const recruitmentProfileSchema = mongoose.Schema({
  PK_iHosoTuyendungID:{
    type: Number,
    required: true,
    unique: true,
  },
  sHotenUngvien: {
    type: String,
    require: true,
  },
  sTenUngvien: {
    type: String,
    require: true,
  },
  sEmailUngvien: {
    type: String,
    default: 'bacdau0302@gmail.com',
    require: true,
  },
  sDienthoaiUngvien: {
    type: String,
    require: true,
  },
  sDuongdanHosoUngvien: {
    type: String,
    default: '',
  },
  FK_iNguoiLuuID: {
    type: Schema.Types.ObjectId, ref: 'Staff', required: true
  },
  tThoigianLuu: {
    type: Date,
    default: new Date(),
  },
  FK_iTrangthaiHosoTuyendungID: {
    type: Schema.Types.ObjectId, ref: 'RecruitmentProfileStatus', required: true
  },
  sDanhgiaHoso: {
    type: String,
  },
  FK_iNguoiDanhgiaHosoID: {
    type: Schema.Types.ObjectId, ref: 'Staff'
  },
  tThoigianDanhgiaHoso: {
    type: Date,
    default: null,
  },
  bGioitinhUngvien: {
    type: Boolean,
    default: true,
  },
  dNgaysinhUngvien: {
    type: Date,
    default: new Date(),
  },
  sDiachiUngvien: {
    type: String,
    required: true,
  },
  FK_iChitietKehoachTuyendungID: {
    type: Schema.Types.ObjectId, ref: 'RecruitmentPlanDetail' 
  },
})

module.exports = mongoose.model('RecruitmentProfile', recruitmentProfileSchema, 'RecruitmentProfile')