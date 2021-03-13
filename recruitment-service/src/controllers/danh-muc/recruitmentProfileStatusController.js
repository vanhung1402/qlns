import RecruitmentProfileStatus from '../../database/models/danh-muc/recruitmentProfileStatus'

exports.listRecruitmentProfileStatus = (request, response) => {
    const filter = {}
    if (request.query.status) {
        filter.PK_iTrangthaiHosoTuyendungID = { "$gt": request.query.status }
    }
    RecruitmentProfileStatus
        .find(filter, (err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addRecruitmentProfileStatus = (request, response) => {
    let newRecruitmentProfileStatus = new RecruitmentProfileStatus(request.body)
    newRecruitmentProfileStatus.save((err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
