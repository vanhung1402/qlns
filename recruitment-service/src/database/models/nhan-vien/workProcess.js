import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_quatrinh_lamviecSchema = mongoose.Schema({
    PK_iQuatrinhLamviecID: {
        type: Number,
        default: Date.now(),
        unique: true,
        require: true,
    },
    FK_iNhanvienID: { type: Schema.Types.ObjectId, ref: 'tbl_nhanvien', required: true },
    dNgayBatdau: {
        type: Date,
        required: true,
    },
    dNgayKethuc: {
        type: Date,
    },
    FK_iVitriCongviecID: { type: Schema.Types.ObjectId, ref: 'tbl_vitri_congviec', required: true },
    FK_iNguoiChuyenID: { type: Schema.Types.ObjectId, ref: 'tbl_nhanvien', required: true },
    tThoigianChuyen: {
        type: Date,
        required: true,
    },
    sGhichu: {
        type: String
    }
})

module.exports = mongoose.model('tbl_quatrinh_lamviec', tbl_quatrinh_lamviecSchema, 'tbl_quatrinh_lamviec')