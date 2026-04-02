import express from 'express';
import * as controller from '../controllers/auth.controller';
import { loginValidate } from '../validators/auth.validate';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/login', loginValidate, controller.login);
router.post('/logout', authMiddleware, controller.logout);

export const authRoute: express.Router = router;
