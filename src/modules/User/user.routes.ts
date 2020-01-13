import { Router } from 'express';

import { userById } from './user.controller';

export const userRouter = Router();

userRouter.param('userId', userById);
