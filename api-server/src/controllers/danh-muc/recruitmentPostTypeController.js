import RecruitmentPostType from './../../database/models/danh-muc/recruitmentPostType'

exports.listRecruitmentPostType = (request, response) => {
    let filter = request.body.filter
    RecruitmentPostType
        .find(filter)
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addRecruitmentPostType = (request, response) => {
    let newRecruitmentPostType = new RecruitmentPostType(request.body)
    newRecruitmentPostType.save(function (err, doc) {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
