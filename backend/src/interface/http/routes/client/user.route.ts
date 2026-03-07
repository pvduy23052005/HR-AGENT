import express from 'express';
import * as controller from '../../controllers/client/user.controller';
import { forgotPasswordValidate, otpPasswordValidate, resetPasswordValidate } from '../../validators/client/user.validate';

const router = express.Router();

router.post('/password/forgot', forgotPasswordValidate, controller.forgotPassword);
router.post('/password/otp', otpPasswordValidate, controller.verifyOTP);
router.post('/password/reset', resetPasswordValidate, controller.resetPassword);

export const userRoute: express.Router = router;
