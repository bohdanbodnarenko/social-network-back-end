import { Router } from 'express';

import { channelById } from '../channel/channel.controller';
import { isAuth, isChannelMember, isMessageOwner, saveImage } from '../shared/middlewares';
import { createMessage, deleteMessages, getMessages, messageById, updateMessage } from './message.controller';

export const messageRouter = Router();

messageRouter.param('channelId', channelById);
messageRouter.param('messageId', messageById);

/**
 * @swagger
 * /message/all/{channelId}:
 *   get:
 *     parameters:
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *        required:
 *          false
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required:
 *          false
 *      - in: path
 *        name: channelId
 *        schema:
 *          type: string
 *        required:
 *          true
 *        description: "Id of channel"
 *     tags:
 *       - Message
 *     name: Get messages
 *     summary: Returns messages
 *     responses:
 *       200:
 *         description: Returns messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     $ref: '#/components/schemas/Message'
 *       403:
 *         description: 'Not a channel member'
 *       404:
 *         description: 'Channel not found'
 */
messageRouter.get('/message/all/:channelId', isAuth, isChannelMember, getMessages);

/**
 * @swagger
 * /message/{channelId}:
 *   post:
 *     parameters:
 *      - in: path
 *        name: channelId
 *        schema:
 *          type: string
 *        required:
 *          true
 *        description: "Id of channel"
 *     tags:
 *       - Message
 *     name: Create message
 *     summary: Creates a message
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Creates a message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   $ref: '#/components/schemas/Message'
 *       403:
 *         description: 'Not a channel member'
 *       404:
 *         description: 'Channel not found'
 */
messageRouter.post('/message/:channelId', isAuth, isChannelMember, saveImage, createMessage);

/**
 * @swagger
 * /message/{messageId}:
 *   put:
 *     parameters:
 *      - in: path
 *        name: messageId
 *        schema:
 *          type: number
 *        required:
 *          true
 *        description: "Id of channel"
 *     tags:
 *       - Message
 *     name: Update message
 *     summary: Updates a message
 *     responses:
 *       200:
 *         description: Updates a message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   $ref: '#/components/schemas/Message'
 *       403:
 *         description: 'Not a message sender'
 *       404:
 *         description: 'Message not found'
 */
messageRouter.put('/message/:messageId', isAuth, isMessageOwner, updateMessage);

/**
 * @swagger
 * /message:
 *   delete:
 *     tags:
 *       - Message
 *     name: Update message
 *     summary: Updates a message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messageIds:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: 'Array of ids of message to delete'
 *             required:
 *               - messageIds
 *     responses:
 *       200:
 *         description: Updates a message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   $ref: '#/components/schemas/Message'
 *       403:
 *         description: 'Not a message sender'
 *       404:
 *         description: 'Message not found'
 */
messageRouter.delete('/message', isAuth, deleteMessages);
