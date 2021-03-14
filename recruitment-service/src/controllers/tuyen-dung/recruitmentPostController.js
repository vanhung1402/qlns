import tbl_nhanvien from './../../database/models/nhan-vien/staff'
import tbl_bantin_tuyendung from '../../database/models/tuyen-dung/recruitmentPost'
import { format as dateFormat } from 'date-fns'

exports.addPost = async (request, response) => {
    const params = request.body
    const createBy = await tbl_nhanvien.findOne({ PK_iNhanvienID: params.createBy }).exec()
    const newPost = new tbl_bantin_tuyendung({
        PK_iBantinTuyendungID: Date.now(),
        FK_iChitietKehoachTuyendungID: params.recruitmentPlanDetailSelected,
        sTieudeTinTuyendung: params.titleNews,
        sNoidungTinTuyendung: params.contentNews,
        FK_iNguoiDangID: createBy,
        tThoigianDang: new Date(),
        tThoigianHethan: params.timeExpire,
    })

    newPost.save((err, doc) => {
        if (err) throw err
        response.json(doc)
    })
}

exports.updatePost = async (request, response) => {
    const filter = { _id: request.params.postId }
    const params = request.body
    const createBy = await tbl_nhanvien.findOne({ PK_iNhanvienID: params.createBy }).exec()
    const updatePost = {
        FK_iChitietKehoachTuyendungID: params.recruitmentPlanDetailSelected,
        sTieudeTinTuyendung: params.titleNews,
        sNoidungTinTuyendung: params.contentNews,
        FK_iNguoiDangID: createBy,
        tThoigianDang: new Date(),
        tThoigianHethan: params.timeExpire,
    }

    tbl_bantin_tuyendung.findOneAndUpdate(filter, updatePost, {new: true}, (err, doc) => {
        if (err) throw err
        response.json(doc)
    })
}

exports.listPost = (request, response) => {
    const filter = request.params.filter

    tbl_bantin_tuyendung
        .find(filter)
        .populate({
            path: 'FK_iChitietKehoachTuyendungID',
            select: 'FK_iKehoachTuyendungID',
            populate: [
                {
                    path: 'FK_iKehoachTuyendungID',
                    select: 'sTieudeKehoach',
                },
                {
                    path: 'FK_iVitriCongviecID',
                    select: 'sTenVitriCongviec',
                },
            ]
        })
        .populate({ path: 'FK_iNguoiDangID', select: 'sHoten' })
        .exec((err, doc) => {
            if (err) throw err
            response.json(doc.map(post => {
                const postFormat = JSON.parse(JSON.stringify(post))
                postFormat.txtThoigianDang = dateFormat(post.tThoigianDang, 'dd/MM/yyyy HH:mm')
                postFormat.txtThoigianHethan = dateFormat(post.tThoigianHethan, 'dd/MM/yyyy HH:mm')
                return postFormat
            }))
        })
}