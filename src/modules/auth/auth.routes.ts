import { Router } from 'express';
import * as passport from 'passport';

import { authMiddleware, isAuth, saveImage } from '../shared/middlewares';
import {
    changePassword,
    confirmEmail,
    googleAuthCallback,
    login,
    me,
    registerUser,
    sendConfirmationAgain,
    sendForgotPasswordEmail,
} from './auth.controller';

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

/**
 * @swagger
 * /me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Auth
 *     name: Me
 *     summary: Returns a logged user
 *     responses:
 *       200:
 *         description: Returns a logged user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: 'L1tt7GEMkJdBXkR-tP0Y0eZ0ejFKAPiBBLLZHCB7fow.eyJpZCI6MiwiaWF0IjoxNTgxMzM3OTk5LCJleHAiOjE1ODE1MTA3OTl9'
 *       403:
 *         description: Not logged to get this resource
 */
authRouter.get('/me', isAuth, me);

/**
 * @swagger
 * /confirm/{id}:
 *   get:
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required:
 *           true
 *         description: Id of response sent to email to email to confirm
 *     name: Me
 *     summary: Returns a logged user
 *     responses:
 *       200:
 *         description: Returns an ok message that email confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ok
 *       400:
 *         description: Bad confirmation id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'invalid'
 */
authRouter.get('/confirm/:id', confirmEmail);

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Auth
 *     name: Register
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *               dateOfBirth:
 *                 type: string
 *                 format: date-time
 *               about:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Registration success'
 *       400:
 *         description: Bad fields in request
 *       403:
 *         description: Email is taken already
 */
authRouter.post('/register', saveImage, registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     name: Login
 *     summary: Logs in a user
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: 'L1tt7GEMkJdBXkR-tP0Y0eZ0ejFKAPiBBLLZHCB7fow.eyJpZCI6MiwiaWF0IjoxNTgxMzM3OTk5LCJleHAiOjE1ODE1MTA3OTl9'
 *       400:
 *         description: Bad fields in request
 *       403:
 *         description: Email is not confirmed
 *       404:
 *         description: User with this email does not exist
 */
authRouter.post('/login', authMiddleware.optional, login);

/**
 * @swagger
 * /change-password:
 *   post:
 *     tags:
 *       - Auth
 *     name: Change password
 *     summary: Send reset password link to email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Please check your email for the next steps'

 *       404:
 *         description: User with this email does not exist
 */
authRouter.post('/change-password', sendForgotPasswordEmail);

/**
 * @swagger
 * /reset-password/{id}:
 *   post:
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required:
 *           true
 *         description: Id of confirmation link sent to email
 *     name: Reset password
 *     summary: Set a new password to the user by password link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password successfully changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Password successfully changed'

 *       404:
 *         description: Bad id of password reset
 */
authRouter.post('/reset-password/:key', changePassword);

/**
 * @swagger
 * /send-confirmation:
 *   post:
 *     tags:
 *       - Auth
 *     name: Send confirmation
 *     summary: Email confirmation link again
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Link emailed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Confirmation successfully sent'

 *       400:
 *         description: Bad email or user does not exist
 */
authRouter.post('/send-confirmation', sendConfirmationAgain);

authRouter.post('/reset-password/:key', changePassword);

authRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     name: Auth with google
 *     summary: Auth to existing user by Google or create a new one
 *     responses:
 *       200:
 *         description: Auth success
 *       302:
 *         description: Redirect to google page
 */
authRouter.get(
    '/auth/google/callback',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
    googleAuthCallback,
);
