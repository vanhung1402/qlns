import JobPosition from './../../database/models/cau-hinh/jobPosition'

exports.listJobPosition = (request, response) => {
    let filter = request.body.filter
    JobPosition
        .find(filter)
        .populate('FK_iBophanID')
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addJobPosition = (request, response) => {
    let newDaparment = new JobPosition(request.body)
    newDaparment.save(function (err, doc) {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
