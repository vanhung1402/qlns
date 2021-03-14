import tbl_kehoach_tuyendung from '../../database/models/tuyen-dung/recruitmentPlan'
import tbl_nhanvien from './../../database/models/nhan-vien/staff'
import dm_trangthai_kehoach_tuyendung from './../../database/models/danh-muc/recruitmentPlanStatus'
import tbl_chitiet_kehoach_tuyendung from './../../database/models/tuyen-dung/recruitmentPlanDetail'
import { format as dateFormat } from 'date-fns'

exports.addPlan = async (request, response) => {
    let params = request.body
    let createBy = await tbl_nhanvien.findOne({ PK_iNhanvienID: params.createBy }).exec()
    let status = await dm_trangthai_kehoach_tuyendung.findOne({ PK_iTrangthaiKehoachTuyendungID: 1 }).exec()
    let newRecruitmentPlan = new tbl_kehoach_tuyendung({
        PK_iKehoachTuyendungID: Date.now(),
        sTieudeKehoach: params.title,
        sNoidungKehoach: params.content,
        FK_iNguoilapKehoachID: createBy,
        tThoigianLapKehoach: new Date(),
        FK_iTrangthaiKehoachTuyendungID: status
    })
    newRecruitmentPlan.save(async function (err, doc) {
        if (err)
            response.send(err)
        let detailSaved = await savePlanDetail(newRecruitmentPlan, request.body.detail)
        response.json({ plan: doc, details: detailSaved })
    })
}

async function savePlanDetail(plan, listPlanDetail) {
    let newId = Date.now()
    let listSaved = []
    listPlanDetail.forEach(async (planDetail) => {
        const newPlanDetail = new tbl_chitiet_kehoach_tuyendung({
            PK_iChitietKehoachTuyendungID: newId++,
            FK_iKehoachTuyendungID: plan,
            FK_iVitriCongviecID: planDetail.viTricongViec,
            iSoluong: planDetail.soLuong,
            sLydoTuyen: planDetail.lyDoTuyen,
            iMucluongDukien: planDetail.mucLuongDukien,
            dNgayBatdauNhanHosoTuyendung: planDetail.thoiGianNhanHoSo[0],
            dNgayKethucNhanHosoTuyendung: planDetail.thoiGianNhanHoSo[1] || planDetail.thoiGianNhanHoSo[0],
            dNgayBatdauTestHosoTuyendung: planDetail.thoiGianDuyetHoSo[0],
            dNgayKethucTestHosoTuyendung: planDetail.thoiGianDuyetHoSo[1] || planDetail.thoiGianDuyetHoSo[0],
            dNgayBatdauPhongvanTuyendung: planDetail.thoiGianPhongVan[0],
            dNgayKethucPhongvanTuyendung: planDetail.thoiGianPhongVan[1] || planDetail.thoiGianPhongVan[0],
            FK_iHinhthucDangtuyenID: planDetail.hinhThucDangTuyen,
            iKinhphiDutruTuyendung: planDetail.kinhPhiDuKien,
        })
        let savedDetail = await newPlanDetail.save()
        listSaved.push(savedDetail)
    });

    return listSaved
}

exports.getListPlanWithStatus = async (request, response) => {
    let { filter, statusId } = request.query
    tbl_kehoach_tuyendung
        .find(filter)
        .populate('FK_iNguoilapKehoachID')
        .populate({
            path: 'FK_iTrangthaiKehoachTuyendungID',
            match: { PK_iTrangthaiKehoachTuyendungID: statusId }
        })
        .populate('FK_iNguoiduyetKehoachID')
        .populate('details')
        .exec(function (err, doc) {
            if (err)
                response.send(err)
            let formatListPlan = doc.reduce((filtered, plan) => {
                if (plan.FK_iTrangthaiKehoachTuyendungID) {
                    const planFormat = JSON.parse(JSON.stringify(plan))
                    planFormat.txtThoigianLap = dateFormat(plan.tThoigianLapKehoach, 'dd/MM/yyyy H:m:i')
                    filtered.push(planFormat)
                }
                return filtered
            }, [])
            response.json(formatListPlan)
        });
}

exports.getListPlan = async (request, response) => {
    let filter = request.body
    tbl_kehoach_tuyendung
        .find(filter)
        .populate('FK_iNguoilapKehoachID')
        .populate('FK_iTrangthaiKehoachTuyendungID')
        .populate('FK_iNguoiduyetKehoachID')
        .populate('details')
        .exec(function (err, doc) {
            if (err)
                response.send(err)
            let formatListPlan = doc.map(plan => {
                const planFormat = JSON.parse(JSON.stringify(plan))
                planFormat.txtThoigianLap = dateFormat(plan.tThoigianLapKehoach, 'dd/MM/yyyy HH:mm:ii')
                return planFormat
            })
            response.json(formatListPlan)
        });
}

exports.getListPlanDetailOfPlan = (request, response) => {
    let filter = request.query
    tbl_chitiet_kehoach_tuyendung
        .find(filter)
        .populate('FK_iVitriCongviecID')
        .populate('FK_iHinhthucDangtuyenID')
        .exec((err, doc) => {
            if (err) throw err
            response.json(doc)
        })
}

async function getListPlanDetail(filter) {
    return await tbl_chitiet_kehoach_tuyendung
        .find(filter)
        .select('sTieudeKehoach sTenVitriCongviec')
        .populate('FK_iKehoachTuyendungID')
        .populate('FK_iVitriCongviecID')
        .exec()
}

exports.getListPlanDetailAvailable = async (request, response) => {
    let filter = request.query
    response.json(await getListPlanDetail(filter))
}

exports.updatePlan = async (request, response) => {
    let planId = request.params.planId
    let { action, params } = request.body
    const filter = { _id: planId }
    let updateBy = await tbl_nhanvien.findOne({ PK_iNhanvienID: params.updateBy }).exec()
    if (!updateBy) {
        return false
    }
    let planUpdate = {
        FK_iNguoilapKehoachID: updateBy,
        tThoigianLapKehoach: new Date(),
    }

    let result = { status: 400, textStatus: 'NONE' }

    if (action === 'update') {
        planUpdate = {
            ...planUpdate,
            ...{
                sTieudeKehoach: params.recruitmentPlan.title,
                sNoidungKehoach: params.recruitmentPlan.content,
            }
        }
        await tbl_chitiet_kehoach_tuyendung.deleteMany({ FK_iKehoachTuyendungID: planId })
        let newId = Date.now()
        params.recruitmentPlanDetail.forEach(async (planDetail) => {
            const newPlanDetail = new tbl_chitiet_kehoach_tuyendung({
                PK_iChitietKehoachTuyendungID: newId++,
                FK_iKehoachTuyendungID: planId,
                FK_iVitriCongviecID: planDetail.viTricongViec,
                iSoluong: planDetail.soLuong,
                sLydoTuyen: planDetail.lyDoTuyen,
                iMucluongDukien: planDetail.mucLuongDukien,
                dNgayBatdauNhanHosoTuyendung: planDetail.thoiGianNhanHoSo[0],
                dNgayKethucNhanHosoTuyendung: planDetail.thoiGianNhanHoSo[1] || planDetail.thoiGianNhanHoSo[0],
                dNgayBatdauTestHosoTuyendung: planDetail.thoiGianDuyetHoSo[0],
                dNgayKethucTestHosoTuyendung: planDetail.thoiGianDuyetHoSo[1] || planDetail.thoiGianDuyetHoSo[0],
                dNgayBatdauPhongvanTuyendung: planDetail.thoiGianPhongVan[0],
                dNgayKethucPhongvanTuyendung: planDetail.thoiGianPhongVan[1] || planDetail.thoiGianPhongVan[0],
                FK_iHinhthucDangtuyenID: planDetail.hinhThucDangTuyen,
                iKinhphiDutruTuyendung: planDetail.kinhPhiDuKien,
            })
            await newPlanDetail.save()
        });
        result = { status: 200, textStatus: 'OK' }
    } else if (action === 'change-status') {
        let status = await dm_trangthai_kehoach_tuyendung.findOne({ PK_iTrangthaiKehoachTuyendungID: params.status }).exec()
        if (params.status === 2) {
            planUpdate = {
                FK_iNguoiduyetKehoachID: updateBy,
                tThoigianDuyetKehoach: new Date(),
            }
        }
        let reason = {}
        if (params.status > 2) {
            reason = { sLydo: params.reason }
        }
        planUpdate = {
            ...planUpdate,
            ...{
                FK_iTrangthaiKehoachTuyendungID: status,
            },
            ...reason
        }
    }
    await tbl_kehoach_tuyendung.findOneAndUpdate(filter, planUpdate, { new: true }, (err, doc) => {
        if (err) throw err
        response.json(doc)
    })

}

exports.getPlanInfo = (request, response) => {
    tbl_kehoach_tuyendung
        .findById(request.params.planId)
        .populate('FK_iNguoilapKehoachID')
        .populate('FK_iTrangthaiKehoachTuyendungID')
        .populate('FK_iNguoiduyetKehoachID')
        .exec((err, doc) => {
            if (err) throw err
            const planFormat = JSON.parse(JSON.stringify(doc))
            planFormat.txtThoigianLap = dateFormat(doc.tThoigianLapKehoach, 'dd/MM/yyyy HH:mm:i')
            if (doc.tThoigianDuyetKehoach) {
                planFormat.txtThoigianDuyet = dateFormat(doc.tThoigianDuyetKehoach, 'dd/MM/yyyy HH:mm:i')
            }
            response.json(planFormat)
        })
}

exports.getPlanDetailOfPlan = (request, response) => {
    let filter = { FK_iKehoachTuyendungID: request.params.planId }
    tbl_chitiet_kehoach_tuyendung
        .find(filter)
        .populate('FK_iVitriCongviecID')
        .populate('FK_iHinhthucDangtuyenID')
        .exec((err, doc) => {
            if (err) throw err
            response.json(doc)
        })
}

exports.getPlanAvailable = (request, response) => {
    const filter = request.params.filter
    tbl_kehoach_tuyendung
        .find(filter)
        .populate('FK_iTrangthaiKehoachTuyendungID')
        .select('sTieudeKehoach FK_iTrangthaiKehoachTuyendungID')
        .exec((err, doc) => {
            if (err) throw err
            response.json(doc.filter(plan => {return plan.FK_iTrangthaiKehoachTuyendungID.PK_iTrangthaiKehoachTuyendungID === 2}))
        })
}