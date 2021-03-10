import mongoose from 'mongoose'

const recruitmentDecisionPatternSchema = mongoose.Schema({
    PK_iMauQuydinhTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sNoidungMauQuyetdinhTuyendung: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('RecruitmentDecisionPattern', recruitmentDecisionPatternSchema, 'RecruitmentDecisionPattern')