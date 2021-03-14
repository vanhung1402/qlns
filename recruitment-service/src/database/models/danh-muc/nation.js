import mongoose from 'mongoose'

const dm_dantocSchema = mongoose.Schema({
    PK_iDantocID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenDantoc: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('dm_dantoc', dm_dantocSchema, 'dm_dantoc')