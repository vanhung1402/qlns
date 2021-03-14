import dm_trangthai_quyetdinh_tuyendung from '../../database/models/danh-muc/recruitmentDecisionStatus'

exports.listRecruitmentDecisionStatus = (request, response) => {
    let filter = request.body.filter
    dm_trangthai_quyetdinh_tuyendung
        .find(filter)
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addRecruitmentDecisionStatus = (request, response) => {
    let newRecruitmentDecisionStatus = new dm_trangthai_quyetdinh_tuyendung(request.body)
    newRecruitmentDecisionStatus.save((err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
