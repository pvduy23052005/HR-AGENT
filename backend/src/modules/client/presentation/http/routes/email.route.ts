import express from 'express';
import * as controller from '../controllers/email.controller';
import { sendBulkEmailValidate } from '../validators/email.validate';

const router = express.Router();

router.post('/send-bulk', sendBulkEmailValidate, controller.sendBulkEmail);

export const emailRoute: express.Router = router;
