import { AuthReq, ChannelByIdReq } from '../constants/interfaces';
import { NextFunction, Response } from 'express';

export const isChannelOwner = (req: AuthReq & ChannelByIdReq, res: Response, next: NextFunction): Response | void => {
    if (req.channelById.owner.id === req.user.id) {
        return next();
    } else {
        return res.status(403).json({ error: 'Permission denied' });
    }
};
