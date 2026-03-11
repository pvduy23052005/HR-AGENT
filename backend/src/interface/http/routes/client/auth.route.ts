import express from 'express';
import * as controller from '../../controllers/client/auth.controller';
import { loginValidate } from '../../validators/client/auth.validate';
import { authMiddleware } from '../../middlewares/client/auth.middleware';
const router = express.Router();

router.post('/login', loginValidate, controller.login);

router.post("/logout", authMiddleware, controller.logout);

export const authRoute: express.Router = router;
