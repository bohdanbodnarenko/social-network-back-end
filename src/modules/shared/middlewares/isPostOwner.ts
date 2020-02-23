import { AuthReq, PostByIdReq } from '../constants/interfaces';
import { NextFunction, Response } from 'express';

export const isPostOwner = (req: AuthReq & PostByIdReq, res: Response, next: NextFunction): Response => {
    const {
        user,
        post: { owner },
    } = req;
    if (user.id !== owner.id) {
        return res.status(403).json({ error: "You haven't permission to do this" });
    }
    next();
};
