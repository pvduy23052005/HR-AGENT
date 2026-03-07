import express from 'express';
import * as controller from '../../controllers/admin/auth.controller';
import { loginValidate } from '../../validators/admin/auth.validate';
import { authMiddleware } from '../../middlewares/admin/auth.middleware';

const router = express.Router();

router.post('/login', loginValidate, controller.login);
router.post('/logout', authMiddleware, controller.logout);

export const authRoute: express.Router = router;
