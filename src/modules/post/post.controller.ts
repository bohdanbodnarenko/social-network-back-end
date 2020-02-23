import { NextFunction, Response } from 'express';
import * as _ from 'lodash';
import { In } from 'typeorm';

import { AuthReq, PostByIdReq } from '../shared/constants/interfaces';
import { validPostSchema } from '../shared/validations';
import { formatYupError } from '../../utils/formatYupError';
import { Post } from '../../entity';
import { Subscription } from '../../entity/Subscription';

export const postById = async (req: PostByIdReq, res: Response, next: NextFunction): Promise<Response> => {
    const { postId } = req.params;
    const post = await Post.findOne({ where: { id: +postId }, relations: ['comments', 'likes', 'owner'] });
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    delete post.owner.password;
    req.post = post;
    next();
};

export const getPosts = async (req: AuthReq, res: Response): Promise<Response> => {
    const {
        query: { limit, offset, userId, onlyFollowing },
        user,
    } = req;
    let posts: Post[];
    if (onlyFollowing === 'true') {
        const followedIds = (
            await Subscription.createQueryBuilder('subscription')
                .innerJoinAndSelect('subscription.subscribedTo', 'user', 'subscription.subscriber = :userId', {
                    userId: user.id,
                })
                .select('user.id')
                .getMany()
        ).map(({ subscribedTo: { id } }) => id);

        if (!followedIds.length) {
            return res.json([]);
        }

        posts = await Post.find({
            where: { owner: In(followedIds) },
            take: limit && limit <= 50 ? limit : 20,
            skip: offset || 0,
            order: { created: 'DESC' },
        });
    } else {
        posts = await Post.find({
            where: userId ? { owner: userId } : {},
            take: limit && limit <= 50 ? limit : 20,
            skip: offset || 0,
            order: { created: 'DESC' },
        });
    }

    return res.json(posts);
};

export const getPost = async (req: PostByIdReq, res: Response): Promise<Response> => {
    return res.json(req.post);
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

export const updatePost = async (req: PostByIdReq, res: Response): Promise<Response> => {
    const { body, post } = req;

    const fieldsToUpdate = _.pick(body, ['title', 'body']);
    await Post.update(post.id, fieldsToUpdate);

    return res.json({ ...post, ...fieldsToUpdate });
};

export const deletePost = async (req: PostByIdReq, res: Response): Promise<Response> => {
    await req.post.remove();
    return res.json({ message: 'Post deleted successfully' });
};
