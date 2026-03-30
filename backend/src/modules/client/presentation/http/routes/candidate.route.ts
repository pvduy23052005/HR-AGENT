import express from 'express';
import * as controller from '../controllers/candidate.controller';
const router = express.Router();

router.get('/', controller.getCandidates);

router.get('/:candidateID', controller.getCandidateDetail);

router.patch("/change-status/:id", controller.updateStatus);

export const candidateRoute: express.Router = router;
