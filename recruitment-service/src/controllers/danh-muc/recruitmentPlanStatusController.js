import dm_trangthai_kehoach_tuyendung from '../../database/models/danh-muc/recruitmentPlanStatus'

exports.listRecruitmentPlanStatus = (request, response) => {
    let filter = request.body.filter
    dm_trangthai_kehoach_tuyendung
        .find(filter)
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addRecruitmentPlanStatus = (request, response) => {
    let newRecruitmentPlanStatus = new dm_trangthai_kehoach_tuyendung(request.body)
    newRecruitmentPlanStatus.save((err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
