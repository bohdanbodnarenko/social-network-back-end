import { Router } from 'express';

import { createPost, getPosts } from './post.controller';
import { isAuth } from '../shared/middlewares/isAuth';

export const postRouter = Router();

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
postRouter.get('/post/all', getPosts);

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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
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
postRouter.post('/post', isAuth, createPost);
