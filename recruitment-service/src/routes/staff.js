import { Router } from 'express'
import Staff from '../controllers/nhan-vien/staffController'

const router = Router()

router.get('/staff', Staff.addExample)
router.get('/list-staff', Staff.getList)
router.get('/list-signed-by', Staff.getListSignedBy)

export default router
