import mongoose from 'mongoose'
const Schema = mongoose.Schema

const workProcessSchema = mongoose.Schema({
    PK_iQuatrinhLamviecID: {
        type: Number,
        default: Date.now(),
        unique: true,
        require: true,
    },
    FK_iNhanvienID: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    dNgayBatdau: {
        type: Date,
        required: true,
    },
    dNgayKethuc: {
        type: Date,
    },
    FK_iVitriCongviecID: { type: Schema.Types.ObjectId, ref: 'JobPosition', required: true },
    FK_iNguoiChuyenID: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    tThoigianChuyen: {
        type: Date,
        required: true,
    },
    sGhichu: {
        type: String
    }
})

module.exports = mongoose.model('WorkProcess', workProcessSchema, 'WorkProcess')