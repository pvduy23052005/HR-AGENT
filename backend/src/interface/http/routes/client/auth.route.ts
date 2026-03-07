import express from 'express';
import * as controller from '../../controllers/client/auth.controller';
import { loginValidate } from '../../validators/client/auth.validate';

const router = express.Router();

router.post('/login', loginValidate, controller.login);

export const authRoute: express.Router = router;
