import mongoose from 'mongoose'

const tbl_bophanSchema = mongoose.Schema({
    PK_iBophanID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenBophan: {
        type: String,
        unique: true
    },
    iThutuBophan: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model('tbl_bophan', tbl_bophanSchema, 'tbl_bophan')