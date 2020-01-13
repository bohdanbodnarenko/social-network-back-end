import { Router } from 'express';

import { isAuth } from '../shared/middlewares/isAuth';
import { changePassword, confirmEmail, login, me, registerUser, sendForgotPasswordEmail } from './auth.controller';

export const authRouter = Router();

authRouter.get('/me', isAuth, me);
authRouter.get('/confirm/:id', confirmEmail);

authRouter.post('/login', login);
authRouter.post('/change-password', sendForgotPasswordEmail);
authRouter.post('/change-password/:key', changePassword);
authRouter.post('/register', registerUser);
