import { Router } from 'express';
import { ReportController } from '../../controllers/client/report.controller';

const router = Router();
const reportController = new ReportController();

router.get('/statistics', reportController.getStatistics);

export const reportRoute = router;
