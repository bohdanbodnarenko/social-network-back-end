import { Response } from 'express';

import { AuthReq, PostByIdReq } from '../shared/constants/interfaces';
import { Like } from '../../entity';

export const likePost = async (req: AuthReq & PostByIdReq, res: Response): Promise<Response> => {
    const { post, user } = req;

    const like = await Like.create({ post, user });
    await like.save();

    post.likes = post.likes.length ? post.likes.concat(like) : [like];
    await post.save();

    return res.json({ message: 'Liked' });
};

export const unlikePost = async (req: AuthReq & PostByIdReq, res: Response): Promise<Response> => {
    const { post, user } = req;

    await Like.delete({ post, user });

    return res.json({ message: 'Unliked' });
};
