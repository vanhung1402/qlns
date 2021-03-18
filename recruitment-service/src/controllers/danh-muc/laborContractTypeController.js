import dm_loaihopdong from '../../database/models/danh-muc/laborContractType'
import tbl_hopdong_laodong from '../../database/models/nhan-vien/laborContract'

exports.listLaborContractType = (request, response) => {
    let filter = request.body.filter
    dm_loaihopdong
        .find(filter)
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
    tbl_hopdong_laodong
        .find({}, (err, doc) => {
            if (err) throw err
            console.log(doc)
        })
}

exports.addLaborContractType = (request, response) => {
    let newLaborContractType = new dm_loaihopdong(request.body)
    newLaborContractType.save((err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
