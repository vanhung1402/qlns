import mongoose from 'mongoose'

const staffSchema = mongoose.Schema({
    PK_iNhanvienID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sHoten: {
        type: String,
        required: true,
    },
    sTen: {
        type: String,
        required: true,
    },
    dNgaysinh: {
        type: Date,
        required: true,
    },
    bGioitinh: {
        type: Boolean,
        required: true
    },
    sDiachi: {
        type: String,
    },
    sDienthoai: {
        type: String,
        unique: true,
        required: true
    },
    sEmail: {
        type: String,
        unique: true,
        required: true
    },
    sCMND: {
        type: String,
        unique: true,
        required: true
    },
    sMasothue: {
        type: String,
        unique: true,
        required: true
    },
    sDuongdanSoyeuLylich: {
        type: String,
    }
})

module.exports = mongoose.model('Staff', staffSchema, 'Staff')