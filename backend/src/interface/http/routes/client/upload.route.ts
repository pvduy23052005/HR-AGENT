import express from 'express';
import multer from 'multer';
import * as controller from '../../controllers/client/upload.controller';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/cv', upload.single('file'), controller.uploadCV);

export const uploadRoute: express.Router = router;
