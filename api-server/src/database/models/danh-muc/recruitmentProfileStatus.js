import mongoose from 'mongoose'

const recruitmentProfileStatusSchema = mongoose.Schema({
    PK_iTrangthaiHosoTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenTrangthaiHosoTuyendung: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('RecruitmentProfileStatus', recruitmentProfileStatusSchema, 'RecruitmentProfileStatus')