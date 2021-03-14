import mongoose from 'mongoose'
import { sha256 } from 'js-sha256'
const Schema = mongoose.Schema

const tbl_taikhoanSchema = mongoose.Schema({
    PK_iTaikhoanID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenTaikhoan: {
        type: String,
        unique: true,
        requied: true,
    },
    sMatkhau: {
        type: String,
        default: sha256('123456789@locifa'),
        required: true,
    },
    FK_iTrangthaiTaikhoan: { type: Schema.Types.ObjectId, ref: 'dm_trangthai_taikhoan' },
    FK_iQuyenID: { type: Schema.Types.ObjectId, ref: 'dm_quyen' },
    FK_iNhanvienID: { type: Schema.Types.ObjectId, ref: 'tbl_nhanvien' },
    FK_iNguoiCapID: { type: Schema.Types.ObjectId, ref: 'tbl_nhanvien' },
    tThoigianCap: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('tbl_taikhoan', tbl_taikhoanSchema, 'tbl_taikhoan')