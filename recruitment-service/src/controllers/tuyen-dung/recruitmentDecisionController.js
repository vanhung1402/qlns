import tbl_mau_quyetdinh_tuyendung from '../../database/models/tuyen-dung/recruitmentDecisionPattern'
import tbl_quyetdinh_tuyendung from '../../database/models/tuyen-dung/recruitmentDecision'
import dm_trangthai_quyetdinh_tuyendung from '../../database/models/danh-muc/recruitmentDecisionStatus'
import { format as dateFormat } from 'date-fns'
import { ObjectId } from 'mongodb'

exports.listDecisionPattern = (request, response) => {
    tbl_mau_quyetdinh_tuyendung
        .find((err, doc) => {
            if (err) throw err
            response.json(doc.sort((a, b) => { a.PK_iMauQuydinhTuyendungID - b.PK_iMauQuydinhTuyendungID }))
        })
}

exports.saveDecisionPattern = (request, response) => {
    let newDecision = new tbl_mau_quyetdinh_tuyendung({
        PK_iMauQuydinhTuyendungID: request.body.decisionId || Date.now(),
        sNoidungMauQuyetdinhTuyendung: request.body.decisionContent || ''
    })
    newDecision.save((err, doc) => {
        if (err) throw err
        response.json(doc)
    })
}

exports.saveDecision = async (request, response) => {
    let params = request.body
    const createBy = ObjectId(params.createBy)
    const status = await dm_trangthai_quyetdinh_tuyendung.findOne({ PK_iTrangthaiQuyetdinhTuyendungID: 1 }).exec()

    if (createBy) {
        if (Array.isArray(params.decision)) {
            let listNewDecision = []
            params.decision.forEach(async decision => {
                let newCruitmentDecision = new tbl_quyetdinh_tuyendung({
                    PK_iQuyetdinhTuyendungID: Date.now(),
                    sNoidungQuyetdinhTuyendung: decision.contentDecision,
                    FK_iNguoiLapQuyetdinhTuyendungID: createBy,
                    tThoigianLapQuyetdinhTuyendung: Date.now(),
                    FK_iHosoTuyendungID: decision.profile,
                    FK_iTrangthaiQuyetdinhTuyendungID: status,
                })

                await newCruitmentDecision.save()
            });
            response.json(listNewDecision)
        } else {
            let newCruitmentDecision = new tbl_quyetdinh_tuyendung({
                PK_iQuyetdinhTuyendungID: Date.now(),
                sNoidungQuyetdinhTuyendung: params.decision.contentDecision,
                FK_iNguoiLapQuyetdinhTuyendungID: createBy,
                tThoigianLapQuyetdinhTuyendung: Date.now(),
                FK_iHosoTuyendungID: params.decision.profile,
                FK_iTrangthaiQuyetdinhTuyendungID: status,
            })

            newCruitmentDecision.save((err, doc) => {
                if (err) throw err
                response.json(doc)
            })
        }
    } else {
        throw new Error('Tài khoản không hợp lệ!')
    }
}

exports.infoDecision = (request, response) => {
    let filter = { _id: request.params.decisionId }
    tbl_quyetdinh_tuyendung
        .findOne(filter)
        .populate([
            {
                path: 'FK_iNguoiLapQuyetdinhTuyendungID',
                select: 'sHoten',
            },
            {
                path: 'FK_iNguoiDuyetQuyetdinhTuyendungID',
                select: 'sHoten',
            },
            {
                path: 'FK_iHosoTuyendungID',
                select: 'sHotenUngvien',
                populate: {
                    path: 'FK_iChitietKehoachTuyendungID',
                    populate: [
                        {
                            path: 'FK_iKehoachTuyendungID',
                            select: 'sTieudeKehoach',
                        },
                        {
                            path: 'FK_iVitriCongviecID',
                            select: 'sTenVitriCongviec FK_iBophanID',
                            populate: 'FK_iBophanID'
                        },
                    ]
                }
            },
            {
                path: 'FK_iTrangthaiQuyetdinhTuyendungID',
            },
        ])
        .exec((err, doc) => {
            if (err) throw err
            let decisionFormat = JSON.parse(JSON.stringify(doc))
            if (doc) {
                let thoiGianDuyet = doc.tThoigianDuyetQuyetdinhTuyendung ? dateFormat(doc.tThoigianDuyetQuyetdinhTuyendung.setHours(doc.tThoigianDuyetQuyetdinhTuyendung.getHours() + 7), 'dd/MM/yyyy HH:mm:i') : ''
                decisionFormat = {
                    ...decisionFormat,
                    txtThoigianLapQuyetdinhTuyendung: dateFormat(doc.tThoigianLapQuyetdinhTuyendung.setHours(doc.tThoigianLapQuyetdinhTuyendung.getHours() + 7), 'dd/MM/yyyy HH:mm:i'),
                    txtThoigianDuyetQuyetdinhTuyendung: thoiGianDuyet,
                }
            }
            response.json(decisionFormat)
        })
}

exports.listDecisions = (request, response) => {
    tbl_quyetdinh_tuyendung
        .find()
        .populate([
            {
                path: 'FK_iNguoiLapQuyetdinhTuyendungID',
                select: 'sHoten',
            },
            {
                path: 'FK_iNguoiDuyetQuyetdinhTuyendungID',
                select: 'sHoten',
            },
            {
                path: 'FK_iHosoTuyendungID',
                select: 'sHotenUngvien',
                populate: {
                    path: 'FK_iChitietKehoachTuyendungID',
                    populate: [
                        {
                            path: 'FK_iKehoachTuyendungID',
                            select: 'sTieudeKehoach',
                        },
                        {
                            path: 'FK_iVitriCongviecID',
                            select: 'sTenVitriCongviec FK_iBophanID',
                            populate: 'FK_iBophanID'
                        },
                    ]
                }
            },
            {
                path: 'FK_iTrangthaiQuyetdinhTuyendungID',
            },

        ])
        .exec((err, doc) => {
            if (err) throw err
            response.json(doc.map(decision => {
                let thoiGianDuyet = decision.tThoigianDuyetQuyetdinhTuyendung ? dateFormat(decision.tThoigianDuyetQuyetdinhTuyendung.setHours(decision.tThoigianDuyetQuyetdinhTuyendung.getHours() + 7), 'dd/MM/yyyy HH:mm:i') : ''
                let decisionFormat = JSON.parse(JSON.stringify(decision))
                return {
                    ...decisionFormat,
                    txtThoigianLapQuyetdinhTuyendung: dateFormat(decision.tThoigianLapQuyetdinhTuyendung.setHours(decision.tThoigianLapQuyetdinhTuyendung.getHours() + 7), 'dd/MM/yyyy HH:mm:i'),
                    txtThoigianDuyetQuyetdinhTuyendung: thoiGianDuyet,
                }
            }))
        })
}

exports.updateDecision = async (request, response) => {
    let params = request.body
    const updateBy = ObjectId(params.updateBy)
    const filter = { _id: params.decisionUpdateId }
    let update = {
        FK_iNguoiLapQuyetdinhTuyendungID: updateBy,
        PK_iQuyetdinhTuyendungID: Date.now(),
    }

    if (updateBy) {
        if (params.action === 'updateContent') {
            if (params.contentDecision) {
                update.sNoidungQuyetdinhTuyendung = params.contentDecision
            }
        } else if (params.action === 'updateStatus') {
            const status = await dm_trangthai_quyetdinh_tuyendung.findOne({ PK_iTrangthaiQuyetdinhTuyendungID: params.status }).exec()
            if (status) {
                update = {
                    FK_iNguoiDuyetQuyetdinhTuyendungID: updateBy,
                    FK_iTrangthaiQuyetdinhTuyendungID: status,
                    tThoigianDuyetQuyetdinhTuyendung: Date.now(),
                    sLydo: params.reason || ''
                }
            }
        }

        tbl_quyetdinh_tuyendung
            .findOneAndUpdate(filter, update, { new: true }, (err, doc) => {
                if (err) throw err
                response.json(doc)
            })
    } else {
        throw new Error('Bạn không có quyền thực hiện')
    }
}