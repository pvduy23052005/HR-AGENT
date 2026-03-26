import express from 'express';
import * as controller from '../../controllers/client/job.controller';
import { createJobValidate } from '../../validators/client/job.validate';

const router = express.Router();

router.get('/', controller.getAllJob);
router.post('/create', createJobValidate, controller.createJob);
router.patch('/update/:id', createJobValidate, controller.updateJob);
router.delete('/delete/:id', controller.deleteJob);

export const jobRoute: express.Router = router;
