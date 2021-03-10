import { Router } from 'express';
import axios from 'axios'
import Session from '../controllers/he-thong/sessionController'

const router = Router();

router.get('/', Session.getSession);

router.post('/', Session.getAuthentication)

export default router;
