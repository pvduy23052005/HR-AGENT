import { Router } from 'express';
import * as controller from '../../controllers/client/report.controller';

const router = Router();

router.get('/statistics', controller.getStatistics);

export const reportRoute = router;
