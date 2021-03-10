import mongoose from 'mongoose'

const recruitmentPostTypeSchema = mongoose.Schema({
    PK_iHinhthucDangtuyenID: {
        type: Number,
        default: Date.now(),
        unique: true
    },
    sTenHinhthucDangtuyen: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('RecruitmentPostType', recruitmentPostTypeSchema, 'RecruitmentPostType')