import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/job.controller.js";
import * as validate from "../../../../shared/validators/client/job.validate.js";

router.post(
  "/create",
  validate.createJobValidate,
  controller.createJob,
);

export const jobRoute = router;
