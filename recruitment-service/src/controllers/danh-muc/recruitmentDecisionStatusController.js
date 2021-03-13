import RecruitmentDecisionStatus from '../../database/models/danh-muc/recruitmentDecisionStatus'

exports.listRecruitmentDecisionStatus = (request, response) => {
    let filter = request.body.filter
    RecruitmentDecisionStatus
        .find(filter)
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addRecruitmentDecisionStatus = (request, response) => {
    let newRecruitmentDecisionStatus = new RecruitmentDecisionStatus(request.body)
    newRecruitmentDecisionStatus.save((err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
