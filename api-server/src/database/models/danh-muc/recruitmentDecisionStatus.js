import mongoose from 'mongoose'

const recruitmentDecisionStatusSchema = mongoose.Schema({
    PK_iTrangthaiQuyetdinhTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenTrangThaiQuyetDinhTuyenDung: {
        type: String,
        unique: true,
    },
})

module.exports = mongoose.model('RecruitmentDecisionStatus', recruitmentDecisionStatusSchema, 'RecruitmentDecisionStatus')