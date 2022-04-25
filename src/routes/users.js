import validation from '../middlewares/validation.js';
import controller from '../controllers/users.js';

import { Router } from "express";

const router = Router();

router.post('/register', validation, controller.REGISTER);
router.get('/users', controller.GET);
router.post('/login', controller.LOGIN);

export default router;