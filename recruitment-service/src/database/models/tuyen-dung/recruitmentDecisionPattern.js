import mongoose from 'mongoose'

const tbl_mau_quyetdinh_tuyendungSchema = mongoose.Schema({
    PK_iMauQuydinhTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sNoidungMauQuyetdinhTuyendung: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('tbl_mau_quyetdinh_tuyendung', tbl_mau_quyetdinh_tuyendungSchema, 'tbl_mau_quyetdinh_tuyendung')