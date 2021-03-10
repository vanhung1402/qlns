import { Router } from 'express'
import Account from '../controllers/he-thong/accountController'

const router = Router()

router.post('/account', Account.addAccount)
router.post('/authenticate', Account.authenticate)

router.get('/list-account', Account.listAccount)

router.put('/doi-mat-khau/:accountId', Account.changePassword)
router.put('/doi-quyen-tai-khoan/:accountId', Account.changePermission)
router.put('/doi-trang-thai-tai-khoan/:accountId', Account.changeStatus)

export default router
