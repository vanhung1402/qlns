import dm_thoihan_hopdong from '../../database/models/danh-muc/contractTerm'

exports.listContractTerm = (request, response) => {
    let filter = request.body.filter
    const list = [
        {
            PK_iThoihanHopdongID: 1,
            sTenThoihanHopdong: '2 tháng',
            iGiatriThoihan: 2,
            sKieuThoihan: 'month',
        },
        {
            PK_iThoihanHopdongID: 2,
            sTenThoihanHopdong: '3 tháng',
            iGiatriThoihan: 3,
            sKieuThoihan: 'month',
        },
        {
            PK_iThoihanHopdongID: 3,
            sTenThoihanHopdong: '6 tháng',
            iGiatriThoihan: 6,
            sKieuThoihan: 'month',
        },
        {
            PK_iThoihanHopdongID: 4,
            sTenThoihanHopdong: '1 năm',
            iGiatriThoihan: 1,
            sKieuThoihan: 'year',
        },
        {
            PK_iThoihanHopdongID: 5,
            sTenThoihanHopdong: '2 năm',
            iGiatriThoihan: 2,
            sKieuThoihan: 'year',
        },
        {
            PK_iThoihanHopdongID: 6,
            sTenThoihanHopdong: '3 năm',
            iGiatriThoihan: 3,
            sKieuThoihan: 'year',
        },
    ]
    list.forEach(el => {
        let newContractTerm = new dm_thoihan_hopdong(el)
        newContractTerm.save((err, doc) => {
            if (err)
                console.log(err)
            console.log(doc)
        })
    });
    dm_thoihan_hopdong
        .find(filter)
        .exec((err, doc) => {
            if (err)
                response.send(err)
            response.json(doc)
        })
}

exports.addContractTerm = (request, response) => {
    let newContractTerm = new dm_thoihan_hopdong(request.body)
    newContractTerm.save((err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}
