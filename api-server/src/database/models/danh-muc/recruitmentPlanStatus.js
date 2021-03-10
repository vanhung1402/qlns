import mongoose from 'mongoose'

const recruitmentPlanStatusSchema = mongoose.Schema({
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

module.exports = mongoose.model('RecruitmentPlanStatus', recruitmentPlanStatusSchema, 'RecruitmentPlanStatus')