import RecruitmentPlanStatus from '../../database/models/danh-muc/recruitmentPlanStatus'

exports.listRecruitmentPlanStatus = (request, response) => {
    let filter = request.body.filter
    RecruitmentPlanStatus
        .find(filter)
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addRecruitmentPlanStatus = (request, response) => {
    let newRecruitmentPlanStatus = new RecruitmentPlanStatus(request.body)
    newRecruitmentPlanStatus.save((err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
