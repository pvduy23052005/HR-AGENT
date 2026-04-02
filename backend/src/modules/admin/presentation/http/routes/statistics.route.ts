import { Router } from "express";
import * as controller from '../controllers/statistics.controller';

const router = Router();

router.get("/statistics", controller.getSystemStatistics);

router.get("/users", controller.getAllHRs);

router.get("/export", controller.exportStatistics);

export const statisticsRoute = router;
