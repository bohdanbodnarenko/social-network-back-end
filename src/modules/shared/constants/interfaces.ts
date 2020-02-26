import { Request } from 'express';

import { Channel, Comment, Message, Post, User } from '../../../entity';

// USER
export interface AuthReq extends Request {
    user: User;
    token: string;
}

export interface UserByIdReq extends Request {
    userById: User;
}

export interface PostByIdReq extends Request {
    post: Post;
}

/**
 * @swagger
 *  components:
 *    schemas:
 *      ShortUser:
 *        type: object
 *        required:
 *          - email
 *          - firstName
 *          - lastName
 *        properties:
 *          id:
 *            type: string
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          imageUrl:
 *            type: string
 *            format: url
 *          online:
 *              type: boolean
 *          lastActive:
 *              type: string
 *              format: date-time
 */
export interface ShortUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    online: boolean;
    imageUrl?: string;
    lastActive: Date;
}

// CHANNEL
export interface ChannelByIdReq extends Request {
    channelById: Channel;
}

// COMMENT
export interface CommentByIdReq extends Request {
    comment: Comment;
}

// MESSAGE
export interface MessageByIdReq extends Request {
    message: Message;
}

// Image
export interface ReqWithImageUrl extends Request {
    imageUrl: string;
}
