import mongoose from 'mongoose'

const dm_thoihan_hopdongSchema = mongoose.Schema({
    PK_iThoihanHopdongID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenThoihanHopdong: {
        type: String,
        unique: true
    },
    iGiatriThoihan:{
        type: Number,
        default: 1, 
    },
    sKieuThoihan: {
        type: String,
        default: 'month',
    }
})

module.exports = mongoose.model('dm_thoihan_hopdong', dm_thoihan_hopdongSchema, 'dm_thoihan_hopdong')