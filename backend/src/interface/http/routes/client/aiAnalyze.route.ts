import express from 'express';
import * as controller from '../../controllers/client/aiAnalyze.controller';
import { validateAnalyzeCandidate } from '../../validators/client/aiAnalysis.validator';

const router = express.Router();

router.post('/analyze', validateAnalyzeCandidate, controller.analyzeCandidate);

export const aiRoute: express.Router = router;
