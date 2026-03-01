import express from "express";
import multer from "multer";
import * as controller from "../../controllers/client/upload.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/cv", upload.single("cv"), controller.uploadCV);

export const uploadRoute = router;
