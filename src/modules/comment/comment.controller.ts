import { NextFunction, Response } from 'express';
import * as _ from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

import { AuthReq, CommentByIdReq, PostByIdReq, ReqWithImageUrl } from '../shared/constants/interfaces';
import { validCommentSchema, validUpdateCommentSchema } from '../shared/validations';
import { formatYupError } from '../../utils';
import { Comment } from '../../entity';
import { uploadsDir } from '../shared/constants/constants';

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

export const createComment = async (req: AuthReq & PostByIdReq & ReqWithImageUrl, res: Response): Promise<Response> => {
    const { body, user, post, imageUrl } = req;

    try {
        await validCommentSchema.validate(body, { abortEarly: false });
    } catch (err) {
        if (imageUrl) {
            fs.unlinkSync(path.join(uploadsDir, imageUrl));
        }
        return res.status(400).json(formatYupError(err));
    }
    const bodyProps = _.pick(body, ['content']);
    const comment = Comment.create({ ...bodyProps, sender: user, post, imageUrl });
    await comment.save();

    return res.json(comment);
};

export const updateComment = async (
    req: AuthReq & CommentByIdReq & ReqWithImageUrl,
    res: Response,
): Promise<Response> => {
    const { comment, body, imageUrl } = req;
    try {
        await validUpdateCommentSchema.validate(body, { abortEarly: false });
    } catch (err) {
        if (imageUrl) {
            fs.unlinkSync(path.join(uploadsDir, imageUrl));
        }
        return res.status(400).json(formatYupError(err));
    }
    const updatesFromBody = { ..._.pick(body, ['content']), updated: new Date(), imageUrl };

    await Comment.update({ id: comment.id }, updatesFromBody);
    return res.json({ ...comment, ...updatesFromBody });
};

export const deleteComment = async (req: AuthReq & CommentByIdReq, res: Response): Promise<Response> => {
    const { comment } = req;
    await comment.remove();
    return res.json({ message: 'Success' });
};
