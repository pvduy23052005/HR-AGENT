import express from "express";
import * as controller from "../../controllers/admin/user.controller.js";
import * as validate from "../../validates/admin/user.validate.js";
const router = express.Router();

router.post("/create", validate.createUserValidate, controller.createUserPost);

router.get("/", controller.getUsers);

router.post("/change-status", controller.changeStatus);

export const userRoute = router;
