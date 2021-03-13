import mongoose from 'mongoose'

const nationSchema = mongoose.Schema({
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

module.exports = mongoose.model('Nation', nationSchema, 'Nation')