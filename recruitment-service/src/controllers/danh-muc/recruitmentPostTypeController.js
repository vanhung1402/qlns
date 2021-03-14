import dm_hinhthuc_dangtuyen from './../../database/models/danh-muc/recruitmentPostType'

exports.listRecruitmentPostType = (request, response) => {
    let filter = request.body.filter
    dm_hinhthuc_dangtuyen
        .find(filter)
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addRecruitmentPostType = (request, response) => {
    let newRecruitmentPostType = new dm_hinhthuc_dangtuyen(request.body)
    newRecruitmentPostType.save(function (err, doc) {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
