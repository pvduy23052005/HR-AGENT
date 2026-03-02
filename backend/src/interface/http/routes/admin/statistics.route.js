import { Router } from "express";
import * as controller from "../../controllers/admin/statistics.controller.js";
const router = Router();

router.get("/", controller.index);

export const statisticsRoute = router;
