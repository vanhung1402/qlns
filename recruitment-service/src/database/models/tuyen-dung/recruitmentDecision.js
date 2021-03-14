import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_quyetdinh_tuyendungSchema = mongoose.Schema({
    PK_iQuyetdinhTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sNoidungQuyetdinhTuyendung: {
        type: String,
        required: true
    },
    FK_iNguoiLapQuyetdinhTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'tbl_nhanvien', reqquired: true,
    },
    tThoigianLapQuyetdinhTuyendung: {
        type: Date,
        required: true,
    },
    FK_iNguoiDuyetQuyetdinhTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'tbl_nhanvien'
    },
    tThoigianDuyetQuyetdinhTuyendung: {
        type: Date,
    },
    FK_iHosoTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'tbl_hoso_tuyendung', required: true
    },
    FK_iTrangthaiQuyetdinhTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'dm_trangthai_quyetdinh_tuyendung', required: true
    },
    sLydo: {
        type: String
    }
})

module.exports = mongoose.model('tbl_quyetdinh_tuyendung', tbl_quyetdinh_tuyendungSchema, 'tbl_quyetdinh_tuyendung')