import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/user.controller.js";

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

export const userRoute = router;
