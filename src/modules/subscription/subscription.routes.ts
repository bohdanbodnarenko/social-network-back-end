import { Router } from 'express';
import { isAuth } from '../shared/middlewares/isAuth';
import { subscribeToUser } from './subscription.controller';

export const subscriptionRouter = Router();

subscriptionRouter.post('/user/subscribe/:userId', isAuth, subscribeToUser);
