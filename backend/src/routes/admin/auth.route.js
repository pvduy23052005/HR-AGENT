import express from "express";
import * as controller from "../../controllers/admin/auth.controller.js";
const router = express.Router();

router.post("/login", controller.loginPost);

export const authRoute = router;
