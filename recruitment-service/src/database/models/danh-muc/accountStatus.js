import mongoose from 'mongoose'

const dm_trangthai_taikhoanSchema = mongoose.Schema({
    PK_iTrangthaiTaikhoanID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenTrangthaiTaikhoan: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('dm_trangthai_taikhoan', dm_trangthai_taikhoanSchema, 'dm_trangthai_taikhoan')