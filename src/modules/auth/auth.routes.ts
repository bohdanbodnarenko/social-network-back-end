import { Router } from 'express';

import { isAuth } from '../shared/middlewares/isAuth';
import { changePassword, confirmEmail, login, me, registerUser, sendForgotPasswordEmail } from './auth.controller';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 */

export const authRouter = Router();

authRouter.get('/me', isAuth, me);
authRouter.get('/confirm/:id', confirmEmail);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     name: Login
 *     summary: Logs in a user
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/components/schemas/User'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - username
 *           - password
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
authRouter.post('/login', login);
authRouter.post('/change-password', sendForgotPasswordEmail);
authRouter.post('/change-password/:key', changePassword);
authRouter.post('/register', registerUser);
