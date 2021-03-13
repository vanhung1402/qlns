import mongoose from 'mongoose'

const accountStatusSchema = mongoose.Schema({
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

module.exports = mongoose.model('AccountStatus', accountStatusSchema, 'AccountStatus')