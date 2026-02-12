import { Router } from "express";
import * as controller from "../../controllers/admin/dashboard.controller.js";
const router = Router();

router.get("/", controller.index);

export const dashboardRoute = router;
