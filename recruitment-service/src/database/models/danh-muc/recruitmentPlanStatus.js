import mongoose from 'mongoose'

const dm_trangthai_kehoach_tuyendungSchema = mongoose.Schema({
    PK_iTrangthaiKehoachTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenTrangthaiKehoachTuyendung: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('dm_trangthai_kehoach_tuyendung', dm_trangthai_kehoach_tuyendungSchema, 'dm_trangthai_kehoach_tuyendung')