import express from 'express';
import * as controller from '../../controllers/admin/user.controller';
import { createUserValidate } from '../../validators/admin/user.validate';

const router = express.Router();

router.post('/create', createUserValidate, controller.createUser);

router.get('/', controller.getUsers);

router.post('/change-status', controller.changeStatus);

export const userRoute: express.Router = router;
