import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_hopdong_laodongSchema = mongoose.Schema({
    PK_iHopdongLaodongID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sSoHopdong: {
        type: String,
        default: Date.now(),
        unique: true,
        required: true,
    },
    sTenHopdong: {
        type: String,
        required: true,
    },
    FK_iLoaiHopdongID: { type: Schema.Types.ObjectId, ref: 'dm_loaihopdong', required: true },
    FK_iThoihanHopdongID: { type: Schema.Types.ObjectId, ref: 'dm_thoihan_hopdong' },
    dNgayKy: {
        type: Date,
        require: true,
    },
    dNgayCoHieuluc: {
        type: Date,
        require: true,
    },
    dNgayHetHan: {
        type: Date,
    },
    FK_iQuatrinhLamviecID: { type: Schema.Types.ObjectId, ref: 'tbl_quatrinh_lamviec', required: true },
    iLuongCoban: {
        type: Number,
        default: 0,
    },
    iLuongDongBaohiem: {
        type: Number,
        default: 0,
    },
    FK_iNguoiKyID: { type: Schema.Types.ObjectId, ref: 'tbl_nhanvien', required: true },
    FK_iNguoiLapID: { type: Schema.Types.ObjectId, ref: 'tbl_nhanvien', required: true },
    sGhichu: {
        type: String,
    },
    sTepDinhkem: {
        type: String,
    },
})

module.exports = mongoose.model('tbl_hopdong_laodong', tbl_hopdong_laodongSchema, 'tbl_hopdong_laodong')