import Department from '../../database/models/cau-hinh/department'

exports.listDepartment = (request, response) => {
    let filter = request.body.filter
    Department.find(filter, (err, doc) => {
        if (err)
            response.send(err)
        response.json(doc.sort((a, b) => a - b))
    })
}

exports.addDepartment = (request, response) => {
    let newDaparment = new Department(request.body)
    newDaparment.save(function (err, doc) {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
