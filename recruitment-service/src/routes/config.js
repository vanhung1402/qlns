import { Router } from 'express'
import Department from '../controllers/cau-hinh/deparmentController'
import JobPosition from './../controllers/cau-hinh/jobPositionController'

const router = Router()

router.get('/list-department', Department.listDepartment)
router.post('/department', Department.addDepartment)

router.get('/list-job-position', JobPosition.listJobPosition)
router.post('/job-position', JobPosition.addJobPosition)

export default router
