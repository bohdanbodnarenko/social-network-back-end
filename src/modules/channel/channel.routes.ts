import { Router } from 'express';

import {
    addMemberToChannel,
    channelById,
    createChannel,
    deleteChannel,
    getChannel,
    getMyChannels,
    kickOutFromChannel,
    leaveFromChannel,
} from './channel.controller';
import { userById } from '../user/user.controller';
import { isAuth, isChannelMember, isChannelOwner } from '../shared/middlewares';

export const channelRouter = Router();

channelRouter.param('channelId', channelById);
channelRouter.param('userId', userById);

/**
 * @swagger
 * /channel:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Channel
 *     name: Create channel
 *     summary: Create a new channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               tag:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *             required:
 *               - name
 *               - tag
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Channel'
 *       400:
 *         description: Bad fields in request
 *       403:
 *         description: Not logged in
 */
channelRouter.post('/channel', isAuth, createChannel);

/**
 * @swagger
 * /channel/{channelId}/leave:
 *   post:
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: sting
 *         required:
 *           true
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Channel
 *     name: Leave channel
 *     summary: Removes user from channel
 *     responses:
 *       200:
 *         description: User left channel successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: string
 *                 example: 'Success'
 *       403:
 *         description: Not logged in or Access denied
 */
channelRouter.post('/channel/:channelId/leave', isAuth, isChannelMember, leaveFromChannel);

/**
 * @swagger
 * /channel/{channelId}/addMember/{userId}:
 *   post:
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: sting
 *         required:
 *           true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: sting
 *         required:
 *           true
 *         description: 'Id of user to add'
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Channel
 *     name: Add user to channel
 *     summary: Add a user from channel
 *     responses:
 *       200:
 *         description: User successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: string
 *                 example: 'Success'
 *       403:
 *         description: Not logged in or Access denied
 */
channelRouter.post('/channel/:channelId/addMember/:userId', isAuth, isChannelOwner, addMemberToChannel);

/**
 * @swagger
 * /channel/{channelId}/kickOut/{userId}:
 *   post:
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: sting
 *         required:
 *           true
 *       - in: path
 *         name: userId
 *         schema:
 *           type: sting
 *         required:
 *           true
 *         description: 'Id of user to delete'
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Channel
 *     name: Kick user from channel
 *     summary: Remove user from channel
 *     responses:
 *       200:
 *         description: User successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: string
 *                 example: 'Success'
 *       403:
 *         description: Not logged in or Access denied
 */
channelRouter.post('/channel/:channelId/kickOut/:userId', isAuth, isChannelOwner, kickOutFromChannel);

/**
 * @swagger
 * /channel/my:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Channel
 *     name: My Channels
 *     summary: Returns all user's channels
 *     responses:
 *       200:
 *         description: Returns all user's channels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     $ref: '#/components/schemas/Channel'
 *       403:
 *         description: Not logged to get this resource
 */
channelRouter.get('/channel/my', isAuth, getMyChannels);

/**
 * @swagger
 * /channel/{channelId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: sting
 *         required:
 *           true
 *     tags:
 *       - Channel
 *     name: Channel by id
 *     summary: Get channel by id
 *     responses:
 *       200:
 *         description: Get channel by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Channel'
 *       403:
 *         description: Access denied to get this channel
 */
channelRouter.get('/channel/:channelId', isAuth, isChannelMember, getChannel);

/**
 * @swagger
 * /channel/{channelId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: sting
 *         required:
 *           true
 *     tags:
 *       - Channel
 *     name: Delete channel
 *     summary: Delete channel by id
 *     responses:
 *       200:
 *         description: Delete channel by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Success'
 *       403:
 *         description: Permission denied to delete this channel
 */
channelRouter.delete('/channel/:channelId', isAuth, isChannelOwner, deleteChannel);
