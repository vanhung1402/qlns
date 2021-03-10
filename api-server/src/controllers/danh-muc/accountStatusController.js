import AccountStatus from '../../database/models/danh-muc/accountStatus'

exports.listAccountStatus = (request, response) => {
    // let example = [
    //     { PK_iTrangthaiTaikhoanID: 1, sTenTrangthaiTaikhoan: 'Đang mở' },
    //     { PK_iTrangthaiTaikhoanID: 2, sTenTrangthaiTaikhoan: 'Đang khóa' },
    // ]

    // example.forEach(accountStatus => {
    //     let accountStatusExample = new AccountStatus(accountStatus)
    //     accountStatusExample.save()
    // });
    let filter = request.body.filter
    AccountStatus.find(filter, (err, listAccountStatus) => {
        if (err)
            response.send(err)
        response.json(listAccountStatus)
    })
}