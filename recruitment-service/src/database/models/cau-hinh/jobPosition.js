import mongoose from 'mongoose'
const Schema = mongoose.Schema

const tbl_vitri_congviecSchema = mongoose.Schema({
    PK_iVitriCongviecID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenVitriCongviec: {
        type: String,
        unique: true,
        required: true,
    },
    FK_iBophanID: { 
        type: Schema.Types.ObjectId, ref: 'tbl_bophan',
        required: true,
    },
    iThutuVitriCongviec: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model('tbl_vitri_congviec', tbl_vitri_congviecSchema, 'tbl_vitri_congviec')