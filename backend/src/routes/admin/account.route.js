import express from "express";
import * as controller from "../../controllers/admin/account.controller.js";
const router = express.Router();

router.post("/create", controller.createPost);

export const accountRoute = router;
