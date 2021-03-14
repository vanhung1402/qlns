import mongoose from 'mongoose'

const dm_trangthai_hosoSchema = mongoose.Schema({
    PK_iTrangthaiHosoTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenTrangthaiHosoTuyendung: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('dm_trangthai_hoso', dm_trangthai_hosoSchema, 'dm_trangthai_hoso')