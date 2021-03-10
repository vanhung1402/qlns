import mongoose from 'mongoose'

const permissionSchema = mongoose.Schema({
    PK_iQuyenID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenQuyen: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('Permission', permissionSchema, 'Permission')