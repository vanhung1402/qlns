import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_kehoach_tuyendungSchema = mongoose.Schema({
    PK_iKehoachTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTieudeKehoach: {
        type: String,
        required: true,
    },
    sNoidungKehoach: {
        type: String,
        required: true,
    },
    FK_iNguoilapKehoachID: {
        type: Schema.Types.ObjectId, ref: 'tbl_nhanvien'
    },
    tThoigianLapKehoach: {
        type: Date,
        required: true,
    },
    FK_iNguoiduyetKehoachID: {
        type: Schema.Types.ObjectId, ref: 'tbl_nhanvien'
    },
    tThoigianDuyetKehoach: {
        type: Date,
    },
    FK_iTrangthaiKehoachTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'dm_trangthai_kehoach_tuyendung'
    },
    sLydo: {
        type: String,
    },
    details: [
        { type: Schema.Types.ObjectId, ref: 'tbl_chitiet_kehoach_tuyendung' }
    ]
})

module.exports = mongoose.model('tbl_kehoach_tuyendung', tbl_kehoach_tuyendungSchema, 'tbl_kehoach_tuyendung')