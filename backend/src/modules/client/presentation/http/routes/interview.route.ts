import express from 'express';
import * as controller from '../controllers/interview.controller';
import { validateScheduleInterview } from '../validators/interview.validator';

const router = express.Router();

router.post('/schedule', validateScheduleInterview, controller.scheduleInterview);

export const interviewRoute: express.Router = router;

