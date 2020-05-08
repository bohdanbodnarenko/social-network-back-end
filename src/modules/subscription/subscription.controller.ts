import * as _ from 'lodash';

import { AuthReq, UserByIdReq } from '../shared/constants/interfaces';
import { Response } from 'express';
import { Subscription } from '../../entity/Subscription';
import { shortUserFields } from '../shared/constants/constants';

export const subscribeToUser = async (req: AuthReq & UserByIdReq, res: Response): Promise<Response> => {
    const { user, userById } = req;

    if (user.id === userById.id) {
        return res.status(400).json({ error: "You can't follow yourself" });
    }
    const alreadyFollowing = await Subscription.findOne({ where: { subscriber: user.id, subscribedTo: userById.id } });
    if (alreadyFollowing) {
        return res.status(403).json({ error: 'You are already followed to this user' });
    }

    await Subscription.create({ subscriber: user, subscribedTo: userById }).save();

    return res.json({ message: 'Ok' });
};

export const unsubscribeFromUser = async (req: AuthReq & UserByIdReq, res: Response): Promise<Response> => {
    const { user, userById } = req;

    if (user.id === userById.id) {
        return res.status(400).json({ error: "You can't un follow yourself" });
    }

    const alreadyFollowing = await Subscription.findOne({ where: { subscriber: user.id, subscribedTo: userById.id } });
    if (!alreadyFollowing) {
        return res.status(403).json({ error: 'You are not followed to this user' });
    }

    await Subscription.delete({ subscriber: user, subscribedTo: userById });

    return res.json({ message: 'Ok' });
};

export const getFollowingCount = async (req: AuthReq & UserByIdReq, res: Response): Promise<Response> => {
    const { userById } = req;
    const following = await Subscription.find({ where: { subscriber: userById } });
    return res.json({ count: following.length });
};

export const getFollowersCount = async (req: AuthReq & UserByIdReq, res: Response): Promise<Response> => {
    const { userById } = req;
    const followers = await Subscription.find({ where: { subscriberTo: userById } });
    return res.json({ count: followers.length });
};

export const getFollowers = async (req: UserByIdReq, res: Response): Promise<Response> => {
    const {
        userById,
        query: { limit, offset, online },
    } = req;
    const take = limit && +limit && +limit <= 200 ? +limit : 50;
    const followers = await Subscription.createQueryBuilder('subscription')
        .leftJoinAndSelect('subscription.subscriber', 'subscriber')
        .where(
            online === undefined
                ? 'subscription.subscribedTo = :userId'
                : 'subscription.subscribedTo = :userId and subscriber.online = :online',
            { userId: userById.id, online },
        )
        .skip(+offset || 0)
        .take(take)
        .getMany();
    return res.json(followers.map(({ subscriber }) => _.pick(subscriber, shortUserFields)));
};

export const getFollowing = async (req: UserByIdReq, res: Response): Promise<Response> => {
    const {
        userById,
        query: { limit, offset, online },
    } = req;
    const take = limit && +limit && +limit <= 200 ? +limit : 50;

    const following = await Subscription.createQueryBuilder('subscription')
        .leftJoinAndSelect('subscription.subscribedTo', 'subscribedTo')
        .where(
            online === undefined
                ? 'subscription.subscriber = :userId'
                : 'subscription.subscriber = :userId and subscribedTo.online = :online',
            { userId: userById.id, online },
        )
        .skip(+offset || 0)
        .take(take)
        .getMany();
    return res.json(following.map(({ subscribedTo }) => _.pick(subscribedTo, shortUserFields)));
};
