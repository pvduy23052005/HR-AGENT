import express from 'express';
import * as controller from '../../controllers/client/candidate.controller';
import { authMiddleware } from '../../middlewares/client/auth.middleware';
const router = express.Router();

router.get('/', authMiddleware, controller.getCandidates);

router.get('/:candidateID', authMiddleware, controller.getCandidateDetail);

export const candidateRoute: express.Router = router;
