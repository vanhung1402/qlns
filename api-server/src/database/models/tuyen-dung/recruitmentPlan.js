import mongoose from 'mongoose'
const Schema = mongoose.Schema

const recruitmentPlanSchema = mongoose.Schema({
    PK_iKehoachTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTieudeKehoach: {
        type: String,
        required: true,
    },
    sNoidungKehoach: {
        type: String,
        required: true,
    },
    FK_iNguoilapKehoachID: { 
        type: Schema.Types.ObjectId, ref: 'Staff' 
    },
    tThoigianLapKehoach: {
        type: Date,
        required: true,
    },
    FK_iNguoiduyetKehoachID: {
        type: Schema.Types.ObjectId, ref: 'Staff'
    },
    tThoigianDuyetKehoach: {
        type: Date,
    },
    FK_iTrangthaiKehoachTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'RecruitmentPlanStatus'
    },
    sLydo: {
        type: String,
    },
    details: [
        {type: Schema.Types.ObjectId, ref: 'RecruitmentPlanDetail' }
    ]
})

module.exports = mongoose.model('RecruitmentPlan', recruitmentPlanSchema, 'RecruitmentPlan')