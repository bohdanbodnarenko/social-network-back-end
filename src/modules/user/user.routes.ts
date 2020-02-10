import { Router } from 'express';

import { getUser, getUsers, updateUser, userById } from './user.controller';
import { isAuth } from '../shared/middlewares/isAuth';

export const userRouter = Router();

userRouter.param('userId', userById);

userRouter.get('/user/all', getUsers);
userRouter.get('/user/:userId', getUser);

userRouter.put('/user', isAuth, updateUser);
