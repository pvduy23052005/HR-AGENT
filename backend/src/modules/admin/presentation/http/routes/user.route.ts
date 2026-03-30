import express from 'express';
import * as controller from '../controllers/user.controller';
import { createUserValidate } from '../validators/user.validate';

const router = express.Router();

router.post('/create', createUserValidate, controller.createUser);

router.get('/', controller.getUsers);

router.patch('/edit/:id', controller.edit);

router.post('/change-status', controller.changeStatus);

export const userRoute: express.Router = router;
