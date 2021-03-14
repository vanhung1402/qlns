import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_nhanvienSchema = mongoose.Schema({
    PK_iNhanvienID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sMaNhanvien: {
        type: String,
        default: Date.now(),
        unique: true,
        required: true,
    },
    sHoten: {
        type: String,
        required: true,
    },
    sTen: {
        type: String,
        required: true,
    },
    dNgaysinh: {
        type: Date,
        required: true,
    },
    sNoisinh: {
        type: String,
        required: true
    },
    bGioitinh: {
        type: Boolean,
        required: true
    },
    sNguyenquan: {
        type: String,
        required: true
    },
    sDiachi: {
        type: String,
    },
    sDienthoai: {
        type: String,
        unique: true,
        required: true
    },
    sEmail: {
        type: String,
        unique: true,
        required: true
    },
    sCMND: {
        type: String,
        unique: true,
        required: true
    },
    dNgaycapCMND: {
        type: Date,
        required: true,
    },
    sNoicapCMND: {
        type: String,
        required: true
    },
    sTrinhdoVanhoa: {
        type: String,
        required: true
    },
    sMasothue: {
        type: String,
    },
    FK_iDantocID: { type: Schema.Types.ObjectId, ref: 'dm_dantoc' },
    FK_iTongiaoID: { type: Schema.Types.ObjectId, ref: 'dm_tongiao' },
    FK_iNguoithemID: { type: Schema.Types.ObjectId, ref: 'tbl_nhanvien', required: true },
    FK_iNguoicapnhatID: { type: Schema.Types.ObjectId, ref: 'tbl_nhanvien' },
    sMotaBanthan: {
        type: String,
    },
    sDuongdanSoyeuLylich: {
        type: String,
    },
    sDuongdanAnhdaidien: {
        type: String,
    }
})

module.exports = mongoose.model('tbl_nhanvien', tbl_nhanvienSchema, 'tbl_nhanvien')