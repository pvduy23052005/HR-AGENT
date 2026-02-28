import express from "express";
import * as controller from "../../controllers/admin/auth.controller.js";
import { authMiddleware } from "../../middlewares/admin/auth.middleware.js";
import { loginValidate } from "../../validates/admin/auth.validate.js";
const router = express.Router();

router.post("/login", loginValidate, controller.login);

router.post("/logout", authMiddleware, controller.logout);

export const authRoute = router;