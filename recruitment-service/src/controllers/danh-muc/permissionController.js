import dm_quyen from '../../database/models/danh-muc/permission'

exports.listPermission = (request, response) => {
    // let examples = [
    //     { PK_iQuyenID: 1, sTenQuyen: 'Nhân viên' },
    //     { PK_iQuyenID: 2, sTenQuyen: 'Trưởng BP sale' },
    //     { PK_iQuyenID: 3, sTenQuyen: 'Trưởng BP hành chính - nhân sự' },
    //     { PK_iQuyenID: 4, sTenQuyen: 'Trưởng BP lương thưởng - phúc lợi' },
    // ]
    // examples.forEach((ex) => {
    //     let exn = new Permission(ex)
    //     exn.save()
    // });
    let filter = request.body.filter
    dm_quyen.find(filter, (err, listPermission) => {
        if (err)
            response.send(err)
        response.json(listPermission)
    })
}