import express from 'express';
import * as controller from '../../controllers/client/candidate.controller';
const router = express.Router();

router.get('/', controller.getCandidates);

router.post("/verify", controller.verifyCandidate);

export const candidateRoute: express.Router = router;
