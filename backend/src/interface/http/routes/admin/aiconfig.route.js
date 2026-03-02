import { Router } from "express";
import * as controller from "../../controllers/admin/aiconfig.controller.js";
const router = Router();

router.get("/", controller.index);

export const aiconfigRoute = router;
