import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_hoso_tuyendungSchema = mongoose.Schema({
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
    type: Schema.Types.ObjectId, ref: 'tbl_nhanvien'
  },
  tThoigianLuu: {
    type: Date,
    default: new Date(),
  },
  FK_iTrangthaiHosoTuyendungID: {
    type: Schema.Types.ObjectId, ref: 'dm_trangthai_hoso', required: true
  },
  sDanhgiaHoso: {
    type: String,
  },
  FK_iNguoiDanhgiaHosoID: {
    type: Schema.Types.ObjectId, ref: 'tbl_nhanvien'
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
    type: Schema.Types.ObjectId, ref: 'tbl_chitiet_kehoach_tuyendung' 
  },
})

module.exports = mongoose.model('tbl_hoso_tuyendung', tbl_hoso_tuyendungSchema, 'tbl_hoso_tuyendung')