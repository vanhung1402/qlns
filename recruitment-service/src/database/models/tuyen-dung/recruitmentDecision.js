import mongoose from 'mongoose'
const Schema = mongoose.Schema

const recruitmentDecisionSchema = mongoose.Schema({
    PK_iQuyetdinhTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sNoidungQuyetdinhTuyendung: {
        type: String,
        required: true
    },
    FK_iNguoiLapQuyetdinhTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'Staff', reqquired: true,
    },
    tThoigianLapQuyetdinhTuyendung: {
        type: Date,
        required: true,
    },
    FK_iNguoiDuyetQuyetdinhTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'Staff'
    },
    tThoigianDuyetQuyetdinhTuyendung: {
        type: Date,
    },
    FK_iHosoTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'RecruitmentProfile', required: true
    },
    FK_iTrangthaiQuyetdinhTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'RecruitmentDecisionStatus', required: true
    },
    sLydo: {
        type: String
    }
})

module.exports = mongoose.model('RecruitmentDecision', recruitmentDecisionSchema, 'RecruitmentDecision')