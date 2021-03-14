import mongoose from 'mongoose'

const dm_quyenSchema = mongoose.Schema({
    PK_iQuyenID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenQuyen: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('dm_quyen', dm_quyenSchema, 'dm_quyen')