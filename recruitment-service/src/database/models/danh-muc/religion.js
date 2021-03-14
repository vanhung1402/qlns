import mongoose from 'mongoose'

const dm_tongiaoSchema = mongoose.Schema({
    PK_iTongiaoID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenTongiao: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('dm_tongiao', dm_tongiaoSchema, 'dm_tongiao')