import { NextFunction, Response } from 'express';

import { AuthReq, MessageByIdReq } from '../constants/interfaces';

export const isMessageOwner = (req: AuthReq & MessageByIdReq, res: Response, next: NextFunction): Response | void => {
    const { user, message } = req;
    if (user.id !== message.sender.id) {
        return res.status(403).json({ error: 'Permission denied' });
    }
    next();
};
