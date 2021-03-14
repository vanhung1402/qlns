import mongoose from 'mongoose'

const dm_hinhthuc_dangtuyenSchema = mongoose.Schema({
    PK_iHinhthucDangtuyenID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenHinhthucDangtuyen: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('dm_hinhthuc_dangtuyen', dm_hinhthuc_dangtuyenSchema, 'dm_hinhthuc_dangtuyen')