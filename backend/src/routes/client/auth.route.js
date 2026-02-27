import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/auth.controller.js";
import * as validate from "../../validates/client/auth.validate.js";

<<<<<<< HEAD
router.post("/login", controller.loginPost);
router.post("/forgot-password", controller.forgotPasswordPost);
=======
router.post("/login", validate.loginValidate, controller.login);
>>>>>>> 6ccd6410596b278feb2354b34fbdf6678f889bf6

export const authRoute = router;
