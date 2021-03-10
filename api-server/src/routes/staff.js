import { Router } from 'express'
import Staff from '../controllers/nhan-vien/staffController'

const router = Router()

router.post('/staff', Staff.addExample)
router.get('/list-staff', Staff.getList)

export default router
