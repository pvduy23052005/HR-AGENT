import express from 'express';
import * as controller from '../../controllers/client/email.controller';

const router = express.Router();

// [POST] /email/send-bulk
router.post('/send-bulk', controller.sendBulkEmail);

export const emailRoute: express.Router = router;
