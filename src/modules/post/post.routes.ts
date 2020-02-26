import { Router } from 'express';

import { createPost, deletePost, getPost, getPosts, postById, updatePost } from './post.controller';
import { isAuth, isPostOwner, saveImage } from '../shared/middlewares';

export const postRouter = Router();

postRouter.param('postId', postById);

/**
 * @swagger
 * /post/all:
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
 *      - in: query
 *        name: userId
 *        schema:
 *          type: integer
 *        required:
 *          false
 *        description: "Id of post's owner"
 *      - in: query
 *        name: onlyFollowing
 *        schema:
 *          type: boolean
 *        required:
 *          false
 *        description: "Return only posts of subscribed followers"
 *     tags:
 *       - Post
 *     name: Get posts
 *     summary: Returns all posts
 *     responses:
 *       200:
 *         description: Returns all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     $ref: '#/components/schemas/Post'
 */
postRouter.get('/post/all', isAuth, getPosts);

/**
 * @swagger
 * /post/{postId}:
 *   get:
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: integer
 *        required:
 *          true
 *     tags:
 *       - Post
 *     name: Get post
 *     summary: Returns post by id
 *     responses:
 *       200:
 *         description: Returns post by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   $ref: '#/components/schemas/Post'
 *       403:
 *         description: Not logged in
 *       404:
 *         description: Post not found
 */
postRouter.get('/post/:postId', isAuth, getPost);

/**
 * @swagger
 * /post:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Post
 *     name: Create a post
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *             required:
 *               - title
 *               - body
 *     responses:
 *       200:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad fields in request
 *       403:
 *         description: Not logged in
 */
postRouter.post('/post', isAuth, saveImage, createPost);

/**
 * @swagger
 * /post/{postId}:
 *   put:
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: integer
 *        required:
 *          true
 *     tags:
 *       - Post
 *     name: Update post
 *     summary: Updates post by id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updates post by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   $ref: '#/components/schemas/Post'
 *       403:
 *         description: Not logged in or not owner of a post
 *       404:
 *         description: Post not found
 */
postRouter.put('/post/:postId', isAuth, isPostOwner, updatePost);

/**
 * @swagger
 * /post/{postId}:
 *   delete:
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: integer
 *        required:
 *          true
 *     tags:
 *       - Post
 *     name: Delete post
 *     summary: Deletes post by id
 *     responses:
 *       200:
 *         description: Deletes post by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Post deleted successfully'
 *       403:
 *         description: Not logged in or not owner of a post
 *       404:
 *         description: Post not found
 */
postRouter.delete('/post/:postId', isAuth, isPostOwner, deletePost);
