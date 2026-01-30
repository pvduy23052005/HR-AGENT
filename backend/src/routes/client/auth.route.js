import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/auth.controller.js";

router.post("/login", controller.loginPost);

export const authRoute = router;
