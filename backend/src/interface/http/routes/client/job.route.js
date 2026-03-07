import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/job.controller.js";
import * as validate from "../../validators/client/job.validate.js";

router.get("/", controller.getAllJob);

router.post("/create", validate.createJobValidate, controller.createJob);

router.patch("/update/:id", validate.createJobValidate, controller.updateJob);

router.delete("/delete/:id", controller.deleteJob);

export const jobRoute = router;
