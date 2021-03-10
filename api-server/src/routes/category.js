import { Router } from 'express'
import AccountStatus from '../controllers/danh-muc/accountStatusController'
import Permission from '../controllers/danh-muc/permissionController'
import RecruitmentPostType from './../controllers/danh-muc/recruitmentPostTypeController'
import RecruitmentPlanStatus from './../controllers/danh-muc/recruitmentPlanStatusController'
import RecruitmentProfileStatus from './../controllers/danh-muc/recruitmentProfileStatusController'
import RecruitmentDecisionStatus from './../controllers/danh-muc/recruitmentDecisionStatusController'

const router = Router()

router.get('/list-account-status', AccountStatus.listAccountStatus)
router.get('/list-permission', Permission.listPermission)

router.get('/list-recruitment-post-type', RecruitmentPostType.listRecruitmentPostType)
router.post('/recruitment-post-type', RecruitmentPostType.addRecruitmentPostType)

router.get('/list-recruitment-plan-status', RecruitmentPlanStatus.listRecruitmentPlanStatus)
router.post('/recruitment-plan-status', RecruitmentPlanStatus.addRecruitmentPlanStatus)

router.get('/list-recruitment-profile-status', RecruitmentProfileStatus.listRecruitmentProfileStatus)
router.post('/recruitment-profile-status', RecruitmentProfileStatus.addRecruitmentProfileStatus)

router.get('/list-recruitment-decision-status', RecruitmentDecisionStatus.listRecruitmentDecisionStatus)
router.post('/recruitment-decision-status', RecruitmentDecisionStatus.addRecruitmentDecisionStatus)

export default router
