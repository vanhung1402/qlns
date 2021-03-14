import tbl_vitri_congviec from './../../database/models/cau-hinh/jobPosition'

exports.listJobPosition = (request, response) => {
    let filter = request.body.filter
    tbl_vitri_congviec
        .find(filter)
        .populate('FK_iBophanID')
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addJobPosition = (request, response) => {
    let newDaparment = new tbl_vitri_congviec(request.body)
    newDaparment.save(function (err, doc) {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
