import express from 'express';
import * as controller from '../../controllers/client/aiAnalyize.controller';
import { validateAnalyizeCandidate } from '../../validators/client/aiAnalysis.validator';

const router = express.Router();

router.post('/analyize', validateAnalyizeCandidate, controller.analyzeCandidate);

export const aiRoute: express.Router = router;
