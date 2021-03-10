import mongoose from 'mongoose'
import { sha256 } from 'js-sha256'
const Schema = mongoose.Schema

const accountSchema = mongoose.Schema({
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
    FK_iTrangthaiTaikhoan: { type: Schema.Types.ObjectId, ref: 'AccountStatus' },
    FK_iQuyenID: { type: Schema.Types.ObjectId, ref: 'Permission' },
    FK_iNhanvienID: { type: Schema.Types.ObjectId, ref: 'Staff' },
    FK_iNguoiCapID: { type: Schema.Types.ObjectId, ref: 'Staff' },
    tThoigianCap: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('Account', accountSchema, 'Account')