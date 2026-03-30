import express from 'express';
import * as controller from '../controllers/verification.controller';
const router = express.Router();

router.post('/confirm', controller.confirmVerification);

router.get('/:candidateID', controller.getVerificationDetail);

router.post('/candidate', controller.verifyCandidate);

export const verificationRoute: express.Router = router;
