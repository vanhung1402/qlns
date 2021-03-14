import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_chitiet_kehoach_tuyendungSchema = mongoose.Schema({
    PK_iChitietKehoachTuyendungID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    FK_iKehoachTuyendungID: {
        type: Schema.Types.ObjectId, ref: 'RecruitmentPlan' 
    },
    FK_iVitriCongviecID: {
        type: Schema.Types.ObjectId, ref: 'tbl_vitri_congviec' 
    },
    iSoluong: {
        type: Number,
        required: true,
    },
    sLydoTuyen: {
        type: String,
    },
    iMucluongDukien: {
        type: Number,
        required: true,
    },
    dNgayBatdauNhanHosoTuyendung: {
        type: Date,
        required: true,
    },
    dNgayKethucNhanHosoTuyendung: {
        type: Date,
        required: true,
    },
    dNgayBatdauTestHosoTuyendung: {
        type: Date,
        required: true,
    },
    dNgayKethucTestHosoTuyendung : {
        type: Date,
        required: true,
    },
    dNgayBatdauPhongvanTuyendung: {
        type: Date,
        required: true,
    },
    dNgayKethucPhongvanTuyendung: {
        type: Date,
        required: true,
    },
    FK_iHinhthucDangtuyenID: {
        type: Schema.Types.ObjectId, ref: 'dm_hinhthuc_dangtuyen' 
    },
    iKinhphiDutruTuyendung: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('tbl_chitiet_kehoach_tuyendung', tbl_chitiet_kehoach_tuyendungSchema, 'tbl_chitiet_kehoach_tuyendung')