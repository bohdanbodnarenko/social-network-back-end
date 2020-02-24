import { Router } from 'express';

import { isAuth } from '../shared/middlewares';
import { likePost, unlikePost } from './like.controller';
import { postById } from '../post/post.controller';

export const likeRouter = Router();

likeRouter.param('postId', postById);

/**
 * @swagger
 * /like/{postId}:
 *   post:
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: integer
 *        required:
 *          true
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Like
 *     name: To like a post
 *     summary: To like a new post
 *     responses:
 *       200:
 *         description: Like created successfully
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 'Liked'
 *       403:
 *         description: Not logged in
 *       404:
 *         description: Post not found
 */
likeRouter.post('/like/:postId', isAuth, likePost);

/**
 * @swagger
 * /unlike/{postId}:
 *   post:
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: integer
 *        required:
 *          true
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Like
 *     name: To unlike a post
 *     summary: To unlike a new post
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 'Unliked'
 *       403:
 *         description: Not logged in
 *       404:
 *         description: Post not found
 */
likeRouter.post('/unlike/:postId', isAuth, unlikePost);
