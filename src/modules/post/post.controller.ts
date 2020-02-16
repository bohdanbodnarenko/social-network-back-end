import { Response } from 'express';
import * as _ from 'lodash';

import { AuthReq } from '../shared/constants/interfaces';
import { validPostSchema } from '../shared/validations';
import { formatYupError } from '../../utils/formatYupError';
import { Post, User } from '../../entity';

export const getPosts = async (req: AuthReq, res: Response): Promise<Response> => {
    const { limit, offset, userId, onlyFollowing } = req.query;
    let followedIds: User[] = [];

    // TODO finish with following users
    if (onlyFollowing === 'true') {
        followedIds = await User.createQueryBuilder('user')
            .innerJoinAndSelect('user.following', 'following')
            .where('members.id = :userId', { userId: req.user.id })
            .select('channel')
            .getMany();
    }

    console.log(followedIds);

    const posts = await Post.find({
        where: userId ? { owner: userId } : onlyFollowing ? {} : {},
        take: limit && limit <= 50 ? limit : 20,
        skip: offset || 0,
        order: { created: 'DESC' },
    });

    return res.json(posts);
};

export const createPost = async (req: AuthReq, res: Response): Promise<Response> => {
    const { user, body } = req;
    try {
        await validPostSchema.validate(body, { abortEarly: false });
    } catch (err) {
        return res.status(400).json(formatYupError(err));
    }

    const newPost = Post.create({ ..._.pick(body, ['title', 'body']), owner: user });
    await newPost.save();

    return res.json(newPost);
};
