import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/user.controller.js";
import * as validate from "../../validates/client/user.validate.js";

router.post(
  "/password/forgot",
  validate.forgotPasswordValidate,
  controller.forgotPassword,
);

router.post(
  "/password/otp",
  validate.otpPasswordValidate,
  controller.otpPassword,
);

router.post(
  "/password/reset",
  validate.resetPasswordValidate,
  controller.resetPassword,
);

export const userRoute = router;