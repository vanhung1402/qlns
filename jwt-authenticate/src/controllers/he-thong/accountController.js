import Account from '../../database/models/he-thong/account'
import AccountStatus from '../../database/models/danh-muc/account-status'
import { sha256 } from 'js-sha256'

exports.addAccount = (request, response) => {
    let newAccount = new Account({
        PK_iTaikhoanID: request.body.id,
        sTenTaikhoan: request.body.username,
        sMatkhau: sha256(request.body.password),
        FK_iQuyenID: request.body.permission,
        FK_iNhanvienID: request.body.employee,
        FK_iNguoiCapID: request.body.createBy,
        FK_iTrangthaiTaikhoan: request.body.status
    })
    newAccount.save(function (err, account) {
        if (err)
            response.send(err)
        response.json(account)
    })
}
exports.listAccount = (request, response) => {
    // Account.deleteMany({}, (err, acc) => {
    //     if (err)
    //         response.send(err)
    //     response.json(acc)
    // })
    let filter = request.body.filter
    Account
        .find(filter)
        .populate('FK_iTrangthaiTaikhoan')
        .populate('FK_iQuyenID')
        .populate('FK_iNhanvienID')
        .exec(function (err, acc) {
            if (err)
                response.send(err)
            response.json(acc)
        });
}

exports.changePassword = (request, response) => {
    const filter = { _id: request.params.accountId }
    const update = { sMatkhau: sha256(request.body.newPassword) }
    Account.findOneAndUpdate(filter, update, { new: true }, (err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}

exports.changePermission = (request, response) => {
    const filter = { PK_iTaikhoanID: request.params.accountId }
    const update = { FK_iQuyenID: request.body.newPermission }
    Account.findOneAndUpdate(filter, update, { new: true }, (err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}

exports.changeStatus = async (request, response) => {
    const statusAccount = await AccountStatus.findOne({ PK_iTrangthaiTaikhoanID: request.body.newStatus }).exec()
    const filter = { _id: request.params.accountId }
    const update = { FK_iTrangthaiTaikhoan: statusAccount }

    Account.findOneAndUpdate(filter, update, { new: true }, (err, doc) => {
        if (err)
            response.send(err)
        response.json(doc)
    })
}

exports.authenticate = (request, response) => {
    const filter = { sTenTaikhoan: request.body.username, sMatkhau: sha256(request.body.password) }
    Account
        .findOne(filter)
        .populate('FK_iTrangthaiTaikhoan')
        .populate('FK_iQuyenID')
        .populate('FK_iNhanvienID')
        .then((doc) => {
            const user = !doc ? null : {
                id: doc.PK_iTaikhoanID,
                username: doc.sTenTaikhoan,
                name: doc.FK_iNhanvienID.sHoten,
                email: doc.FK_iNhanvienID.sEmail,
                permissionname: doc.FK_iQuyenID.sTenQuyen,
                available: doc.FK_iTrangthaiTaikhoan.PK_iTrangthaiTaikhoanID
            }
            response.json(user)
        })
        .catch((err) => {
            if (err)
                response.send(err)
        })
}

exports.getAccount = async ({username, password}) => {
    const filter = { sTenTaikhoan: username, sMatkhau: sha256(password) }
    let doc = await Account
        .findOne(filter)
        .populate('FK_iTrangthaiTaikhoan')
        .populate('FK_iQuyenID')
        .populate('FK_iNhanvienID')
        .catch((err) => {
            if (err)
                console.log(err)
        })
    const user = !doc ? null : {
        id: doc.PK_iTaikhoanID,
        username: doc.sTenTaikhoan,
        password: doc.sTenTaikhoan,
        name: doc.FK_iNhanvienID.sHoten,
        email: doc.FK_iNhanvienID.sEmail,
        permissionname: doc.FK_iQuyenID.sTenQuyen,
        token: `valid-token-for-${doc.sTenTaikhoan}`,
        available: doc.FK_iTrangthaiTaikhoan.PK_iTrangthaiTaikhoanID
    }
    return user
}