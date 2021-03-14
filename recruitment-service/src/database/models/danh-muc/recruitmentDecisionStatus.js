import mongoose from 'mongoose'

const dm_trangthai_quyetdinh_tuyendungSchema = mongoose.Schema({
    PK_iTrangthaiQuyetdinhTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenTrangThaiQuyetDinhTuyenDung: {
        type: String,
        unique: true,
    },
})

module.exports = mongoose.model('dm_trangthai_quyetdinh_tuyendung', dm_trangthai_quyetdinh_tuyendungSchema, 'dm_trangthai_quyetdinh_tuyendung')