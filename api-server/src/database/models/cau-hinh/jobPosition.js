import mongoose from 'mongoose'
const Schema = mongoose.Schema

const jobPositionSchema = mongoose.Schema({
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
        type: Schema.Types.ObjectId, ref: 'Department',
        required: true,
    },
    iThutuVitriCongviec: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model('JobPosition', jobPositionSchema, 'JobPosition')