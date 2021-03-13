import { Router } from 'express'
import TestData from '../controllers/testData'

const router = Router()

router.get('/list-department', TestData.setListDepartment)

export default router
