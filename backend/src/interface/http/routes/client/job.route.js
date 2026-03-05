import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/job.controller.js";
import * as validate from "../../../../shared/validators/client/job.validate.js";

router.post("/create", validate.createJobValidate, controller.createJob);

router.patch("/update/:id", validate.createJobValidate, controller.updateJob);

export const jobRoute = router;
