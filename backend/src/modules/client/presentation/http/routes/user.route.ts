import express from 'express';
import * as controller from '../controllers/user.controller';
import { forgotPasswordValidate, otpPasswordValidate, resetPasswordValidate } from '../validators/user.validate';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = express.Router();

router.post('/password/forgot', forgotPasswordValidate, controller.forgotPassword);

router.post('/password/otp', otpPasswordValidate, controller.verifyOTP);

router.post('/password/reset', resetPasswordValidate, controller.resetPassword);

router.post("/password/reset-not-otp", authMiddleware, resetPasswordValidate, controller.resetNotOTP);


export const userRoute: express.Router = router;
