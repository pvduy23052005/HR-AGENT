import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/aiAnalyize.controller.js";
import { validateAnalyizeCandidate } from "../../validators/client/aiAnalysis.validator.js";

router.post("/analyize", validateAnalyizeCandidate, controller.analyzeCandidate);

export const aiRoute = router;
