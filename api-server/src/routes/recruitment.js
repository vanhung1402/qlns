import { request, response, Router } from 'express'
import Profile from '../controllers/tuyen-dung/profileController'
import RecruitmentPlan from '../controllers/tuyen-dung/recruitmentPlanController'
import RecruitmentPost from '../controllers/tuyen-dung/recruitmentPostController'
import RecruitmentDecision from '../controllers/tuyen-dung/recruitmentDecisionController'

const router = Router()

router.get('/', Profile.delete)
router.post('/profile', Profile.addNew)
router.get('/profile/:profileId', Profile.delete)
router.put('/profile/:profileId', Profile.update)
router.delete('/profile/:profileId', Profile.delete)
router.get('/list-profile', Profile.getList)
router.get('/list-profile-with-status', Profile.getListWithStatus)

router.get('/list-recruitment-plan', RecruitmentPlan.getListPlan)
router.get('/list-recruitment-plan/status', RecruitmentPlan.getListPlanWithStatus)
router.post('/add-recruitment-plan', RecruitmentPlan.addPlan)
router.get('/recruitment-plan/:planId', RecruitmentPlan.getPlanInfo)
router.put('/recruitment-plan/:planId', RecruitmentPlan.updatePlan)
router.get('/recruitment-plan-available', RecruitmentPlan.getPlanAvailable)

router.get('/recruitment-plan-list-detail/:planId', RecruitmentPlan.getPlanDetailOfPlan)
router.get('/list-recruitment-plan-detail-available', RecruitmentPlan.getListPlanDetailAvailable)
router.get('/list-recruitment-plan-detail', RecruitmentPlan.getListPlanDetailOfPlan)

router.post('/recruitment-post', RecruitmentPost.addPost)
router.put('/recruitment-post/:postId', RecruitmentPost.updatePost)
router.get('/list-recruitment-post', RecruitmentPost.listPost)

router.get('/list-recruitment-decisions-pattern', RecruitmentDecision.listDecisionPattern)
router.post('/recruitment-decisions-pattern', RecruitmentDecision.saveDecisionPattern)

router.post('/recruitment-decisions', RecruitmentDecision.saveDecision)
router.get('/recruitment-decisions/:decisionId', RecruitmentDecision.infoDecision)
router.put('/recruitment-decisions', RecruitmentDecision.updateDecision)
router.get('/list-recruitment-decisions', RecruitmentDecision.listDecisions)

export default router
