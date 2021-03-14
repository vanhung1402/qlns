import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_bantin_tuyendungSchema = mongoose.Schema({
    PK_iBantinTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    FK_iChitietKehoachTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'tbl_chitiet_kehoach_tuyendung', required: true
    },
    sTieudeTinTuyendung: {
        type: String,
        required: true,
    },
    sNoidungTinTuyendung: {
        type: String,
        required: true,
    },
    FK_iNguoiDangID: {
        type: Schema.Types.ObjectId, ref: 'tbl_nhanvien', required: true
    },
    tThoigianDang: {
        type: Date,
        required: true,
    },
    tThoigianHethan: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('tbl_bantin_tuyendung', tbl_bantin_tuyendungSchema, 'tbl_bantin_tuyendung')