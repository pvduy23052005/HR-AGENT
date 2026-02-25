import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/auth.controller.js";
import * as validate from "../../validates/client/auth.validate.js";

router.post("/login", validate.loginValidate, controller.login);

export const authRoute = router;
