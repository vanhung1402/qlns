import mongoose from 'mongoose'

const religionSchema = mongoose.Schema({
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

module.exports = mongoose.model('Religion', religionSchema, 'Religion')