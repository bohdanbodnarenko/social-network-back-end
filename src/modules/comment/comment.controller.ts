import { NextFunction, Response } from 'express';
import * as _ from 'lodash';

import { AuthReq, CommentByIdReq, PostByIdReq } from '../shared/constants/interfaces';
import { validCommentSchema, validUpdateCommentSchema } from '../shared/validations';
import { formatYupError } from '../../utils/formatYupError';
import { Comment } from '../../entity';

export const commentById = async (
    req: AuthReq & CommentByIdReq,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { commentId } = req.params;

    const comment = await Comment.findOne({ where: { id: commentId }, relations: ['sender'] });
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    req.comment = comment;
    next();
};

export const createComment = async (req: AuthReq & PostByIdReq, res: Response): Promise<Response> => {
    const { body, user, post } = req;

    try {
        await validCommentSchema.validate(body, { abortEarly: false });
    } catch (err) {
        return res.status(400).json(formatYupError(err));
    }
    const bodyProps = _.pick(body, ['content']);
    const comment = Comment.create({ ...bodyProps, sender: user, post });
    await comment.save();

    return res.json(comment);
};

export const updateComment = async (req: AuthReq & CommentByIdReq, res: Response): Promise<Response> => {
    const { comment, body } = req;
    try {
        await validUpdateCommentSchema.validate(body, { abortEarly: false });
    } catch (err) {
        return res.status(400).json(formatYupError(err));
    }
    const updatesFromBody = { ..._.pick(body, ['content']), updated: new Date() };

    await Comment.update({ id: comment.id }, updatesFromBody);
    res.json({ ...comment, ...updatesFromBody });
};

export const deleteComment = async (req: AuthReq & CommentByIdReq, res: Response): Promise<Response> => {
    const { comment } = req;
    await comment.remove();
    return res.json({ message: 'Success' });
};
