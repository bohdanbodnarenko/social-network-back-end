import { NextFunction, Response } from 'express';

import { AuthReq, CommentByIdReq } from '../constants/interfaces';

export const isCommentOwner = (req: AuthReq & CommentByIdReq, res: Response, next: NextFunction): Response | void => {
    const { user, comment } = req;
    if (user.id !== comment.sender.id) {
        return res.status(403).json({ error: 'Permission denied' });
    }
    next();
};
