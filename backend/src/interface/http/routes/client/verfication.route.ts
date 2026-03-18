import express from 'express';
import * as controller from '../../controllers/client/verification.controller';
const router = express.Router();

// [POST] /verification/confirm - Xác nhận verification status (trusted/risky)
router.post('/confirm', controller.confirmVerification);

// [GET] /verification/:candidateID - Lấy chi tiết kiểm chứng của ứng viên
router.get('/:candidateID', controller.getVerificationDetail);

// [POST] /verification/candidate - Xác minh ứng viên
router.post('/candidate', controller.verifyCandidate);

export const verificationRoute: express.Router = router;
