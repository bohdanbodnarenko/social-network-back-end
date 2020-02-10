import { AuthReq, ChannelByIdReq } from '../constants/interfaces';
import { NextFunction, Response } from 'express';
import { User } from '../../../entity';

export const isChannelMember = async (
    req: AuthReq & ChannelByIdReq,
    res: Response,
    next: NextFunction,
): Promise<Response | void> => {
    const { user, channelById } = req;

    if (channelById.owner.id === user.id) {
        return next();
    }

    try {
        const isMember = await User.createQueryBuilder('user')
            .leftJoinAndSelect('user.channels', 'channel')
            .where('user.id = :id', { id: req.user.id })
            .andWhere('channel.id = :channelId', { channelId: channelById.id })
            .getOne();

        if (!isMember) {
            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
        console.log(e);
    }
};
