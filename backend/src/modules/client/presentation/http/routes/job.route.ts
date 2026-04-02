import express from 'express';
import * as controller from '../controllers/job.controller';
import { createJobValidate } from '../validators/job.validate';

const router = express.Router();

router.get('/', controller.getAllJob);

router.get("/:id/candidates", controller.getCandidateByJob);

router.post('/create', createJobValidate, controller.createJob);

router.patch('/update/:id', createJobValidate, controller.updateJob);

router.delete('/delete/:id', controller.deleteJob);

router.get('/detail/:id', controller.getJobById);

export const jobRoute: express.Router = router;
