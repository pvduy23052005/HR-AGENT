import express from "express";
import * as controller from "../../controllers/admin/auth.controller.js";
import { authMiddleware } from "../../middlewares/admin/auth.middleware.js";
const router = express.Router();

router.post("/login", controller.loginPost);

router.post("/logout", authMiddleware, controller.logout);

export const authRoute = router;
