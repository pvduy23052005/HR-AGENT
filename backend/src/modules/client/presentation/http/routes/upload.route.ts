import express from 'express';
import multer from 'multer';
import * as controller from '../controllers/upload.controller';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/cv', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), controller.uploadCV);

export const uploadRoute: express.Router = router;
