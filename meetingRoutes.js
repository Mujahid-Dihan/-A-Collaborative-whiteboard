import { Router } from 'express';
const router = Router();
import { createMeeting, joinMeeting, endMeeting } from '../controllers/meetingController';

router.post('/create', createMeeting);
router.post('/join', joinMeeting);
router.post('/end', endMeeting);

export default router;
