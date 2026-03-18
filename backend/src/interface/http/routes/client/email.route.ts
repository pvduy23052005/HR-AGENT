import express from 'express';
import * as controller from '../../controllers/client/email.controller';

const router = express.Router();

router.post('/send-bulk', controller.sendBulkEmail);

export const emailRoute: express.Router = router;
