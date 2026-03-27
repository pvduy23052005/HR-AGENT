import express from 'express';
import * as controller from '../../controllers/client/interview.controller';
import { validateScheduleInterview } from '../../validators/client/interview.validator';

const router = express.Router();

router.post('/schedule', validateScheduleInterview, controller.scheduleInterview);

export const interviewRoute: express.Router = router;

