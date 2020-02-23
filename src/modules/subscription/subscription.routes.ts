import { Router } from 'express';
import { isAuth } from '../shared/middlewares';
import {
    getFollowersCount,
    getFollowingCount,
    getFollowers,
    getFollowing,
    subscribeToUser,
    unsubscribeFromUser,
} from './subscription.controller';
import { userById } from '../user/user.controller';

export const subscriptionRouter = Router();

subscriptionRouter.param('userId', userById);

/**
 * @swagger
 * /following/{userId}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required:
 *           true
 *         description: 'Id of user to get following for'
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required:
 *           false
 *         description: 'Limit of users to fetch, max == 200, default == 50'
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         required:
 *           false
 *         description: 'Count of users to skip'
 *       - in: query
 *         name: online
 *         schema:
 *           type: boolean
 *         required:
 *           false
 *         description: 'Fetch users where online status == this param'
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Subscription
 *     name: Get user`s following
 *     summary: Returns user`s following
 *     responses:
 *       200:
 *         description: Successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     $ref: '#/components/schemas/ShortUser'
 *       403:
 *         description: Not logged in or Access denied
 *       404:
 *         description: User with this id does not exist
 */
subscriptionRouter.get('/following/:userId', isAuth, getFollowing);

/**
 * @swagger
 * /following/{userId}/count:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required:
 *           true
 *         description: 'Id of user to get following count for'
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Subscription
 *     name: Get count of user`s following
 *     summary: Returns count of user`s following
 *     responses:
 *       200:
 *         description: Successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count: number
 *                 example: 200
 *       403:
 *         description: Not logged in or Access denied
 *       404:
 *         description: User with this id does not exist
 */
subscriptionRouter.get('/following/:userId/count', isAuth, getFollowingCount);

/**
 * @swagger
 * /followers/{userId}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required:
 *           true
 *         description: 'Id of user to get followers for'
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required:
 *           false
 *         description: 'Limit of users to fetch, max == 200, default == 50'
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         required:
 *           false
 *         description: 'Count of users to skip'
 *       - in: query
 *         name: online
 *         schema:
 *           type: boolean
 *         required:
 *           false
 *         description: 'Fetch users where online status == this param'
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Subscription
 *     name: Get user`s followers
 *     summary: Returns user`s followers
 *     responses:
 *       200:
 *         description: Successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     $ref: '#/components/schemas/ShortUser'
 *       403:
 *         description: Not logged in or Access denied
 *       404:
 *         description: User with this id does not exist
 */
subscriptionRouter.get('/followers/:userId', isAuth, getFollowers);

/**
 * @swagger
 * /followers/{userId}/count:
 *   get:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required:
 *           true
 *         description: 'Id of user to get followers count for'
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Subscription
 *     name: Get count of user`s followers
 *     summary: Returns count of user`s following
 *     responses:
 *       200:
 *         description: Successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count: number
 *                 example: 200
 *       403:
 *         description: Not logged in or Access denied
 *       404:
 *         description: User with this id does not exist
 */
subscriptionRouter.get('/followers/:userId/count', isAuth, getFollowersCount);

/**
 * @swagger
 * /subscribe/{userId}:
 *   post:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required:
 *           true
 *         description: 'Id of user to follow'
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Subscription
 *     name: Subscribe to user
 *     summary: Subscribes logged in user to user by id
 *     responses:
 *       200:
 *         description: Successfully subscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: string
 *                 example: Ok
 *       403:
 *         description: Not logged in or Access denied
 *       404:
 *         description: User with this id does not exist
 */
subscriptionRouter.post('/subscribe/:userId', isAuth, subscribeToUser);

/**
 * @swagger
 * /unsubscribe/{userId}:
 *   post:
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: number
 *         required:
 *           true
 *         description: 'Id of user to unsubscribe'
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Subscription
 *     name: Unsubscribe from user
 *     summary: Unsubscribes logged in user from user by id
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: string
 *                 example: Ok
 *       403:
 *         description: Not logged in or Access denied
 *       404:
 *         description: User with this id does not exist
 */
subscriptionRouter.post('/unsubscribe/:userId', isAuth, unsubscribeFromUser);
