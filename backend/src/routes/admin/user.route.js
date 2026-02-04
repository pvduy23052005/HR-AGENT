import express from "express";
import * as controller from "../../controllers/admin/user.controller.js";
const router = express.Router();

router.post("/create", controller.createUserPost);

export const userRoute = router;
