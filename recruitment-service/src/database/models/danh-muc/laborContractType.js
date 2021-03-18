import mongoose from 'mongoose'

const dm_loaihopdongSchema = mongoose.Schema({
    PK_iLoaiHopdongID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenLoaiHopdong: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('dm_loaihopdong', dm_loaihopdongSchema, 'dm_loaihopdong')