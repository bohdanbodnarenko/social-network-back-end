import { Router } from 'express';

import { commentById, createComment, deleteComment, updateComment } from './comment.controller';
import { isAuth, isCommentOwner, saveImage } from '../shared/middlewares';
import { postById } from '../post/post.controller';

export const commentRouter = Router();

commentRouter.param('postId', postById);
commentRouter.param('commentId', commentById);

/**
 * @swagger
 * /comment/{postId}:
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
 *       - Comment
 *     name: Create comment
 *     summary: Creates a comment to a post by id
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
 *         description: Created a comment successfully
 *         content:
 *           application/json:
 *             type:
 *               $ref: '#/components/schemas/Post'
 *       403:
 *         description: Not logged in
 */
commentRouter.post('/comment/:postId', isAuth, saveImage, createComment);

/**
 * @swagger
 * /comment/{commentId}:
 *   put:
 *     parameters:
 *      - in: path
 *        name: commentId
 *        schema:
 *          type: integer
 *        required:
 *          true
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comment
 *     name: Update comment
 *     summary: Updates a comment
 *     content:
 *       multipart/form-data:
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *             imageUrl:
 *               type: string
 *               format: binary
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             type:
 *               $ref: '#/components/schemas/Post'
 *       403:
 *         description: Not logged in or not owner of the comment
 *       404:
 *         description: Comment not found
 */
commentRouter.put('/comment/:commentId', isAuth, isCommentOwner, saveImage, updateComment);

/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     parameters:
 *      - in: path
 *        name: commentId
 *        schema:
 *          type: integer
 *        required:
 *          true
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comment
 *     name: Delete comment
 *     summary: Deletes a comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 'Success'
 *       403:
 *         description: Not logged in or not owner of the comment
 *       404:
 *         description: Comment not found
 */
commentRouter.delete('/comment/:commentId', isAuth, isCommentOwner, deleteComment);
