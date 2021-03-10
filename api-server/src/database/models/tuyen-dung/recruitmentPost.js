import mongoose from 'mongoose'
const Schema = mongoose.Schema

const recruitmentPostSchema = mongoose.Schema({
    PK_iBantinTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    FK_iChitietKehoachTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'RecruitmentPlanDetail', required: true
    },
    sTieudeTinTuyendung: {
        type: String,
        required: true,
    },
    sNoidungTinTuyendung: {
        type: String,
        required: true,
    },
    FK_iNguoiDangID: {
        type: Schema.Types.ObjectId, ref: 'Staff', required: true
    },
    tThoigianDang: {
        type: Date,
        required: true,
    },
    tThoigianHethan: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('RecruitmentPost', recruitmentPostSchema, 'RecruitmentPost')