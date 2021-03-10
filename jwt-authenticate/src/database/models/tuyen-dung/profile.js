import mongoose from 'mongoose'

const recruitmentProfileSchema = mongoose.Schema({
  sHotenUngvien: {
    type: String,
    default: 'Bùi Văn A',
  },
  sTenUngvien: {
    type: String,
    default: 'A',
  },
  sEmailUngvien: {
    type: String,
    default: 'bacdau0302@gmail.com',
  },
  sDienthoaiUngvien: {
    type: String,
    default: '0329 222 617',
  },
  sDuongdanHosoUngvien: {
    type: String,
    default: '',
  },
  FK_iNguoiLuuID: {
    type: Number,
    default: 0,
  },
  tThoigianLuu: {
    type: Date,
    default: new Date(),
  },
  FK_iTrangthaiHosoID: {
    type: Number,
    default: 0,
  },
  sDanhgiaHoso: {
    type: String,
    default: '',
  },
  FK_iNguoiDanhgiaHosoID: {
    type: Number,
    default: null,
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
  PK_iChitietKehoachTuyendungID: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('RecruitmentProfile', recruitmentProfileSchema, 'RecruitmentProfile')