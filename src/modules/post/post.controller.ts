import { NextFunction, Response } from 'express';
import * as _ from 'lodash';
import { In } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { AuthReq, PostByIdReq, ReqWithImageUrl } from '../shared/constants/interfaces';
import { validPostSchema, validUpdatePostSchema } from '../shared/validations';
import { formatYupError } from '../../utils';
import { Post } from '../../entity';
import { Subscription } from '../../entity/Subscription';
import { uploadsDir } from '../shared/constants/constants';

export const postById = async (req: PostByIdReq, res: Response, next: NextFunction): Promise<Response | void> => {
    const { postId } = req.params;
    if (!+postId) {
        return res.status(400).json({ error: 'Not valid post id' });
    }

    const post = await Post.findOne({ where: { id: +postId }, relations: ['comments', 'likes', 'owner'] });
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    delete post.owner.password;
    req.post = post;
    return next();
};

export const getPosts = async (req: AuthReq, res: Response): Promise<Response> => {
    const {
        query: { limit, offset, userId, onlyFollowing },
        user,
    } = req;
    let posts: Post[];
    const take = limit && +limit && +limit <= 50 ? +limit : 20;
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
            take,
            skip: offset || 0,
            order: { created: 'DESC' },
        } as any);
    } else {
        posts = await Post.find({
            where: userId ? { owner: userId } : {},
            take,
            skip: offset || 0,
            order: { created: 'DESC' },
        } as any);
    }

    return res.json(posts);
};

export const getPost = async (req: PostByIdReq, res: Response): Promise<Response> => {
    return res.json(req.post);
};

export const createPost = async (req: AuthReq & ReqWithImageUrl, res: Response): Promise<Response> => {
    const { user, body, imageUrl } = req;
    try {
        await validPostSchema.validate(body, { abortEarly: false });
    } catch (err) {
        if (imageUrl) {
            fs.unlinkSync(path.join(uploadsDir, imageUrl));
        }
        return res.status(400).json(formatYupError(err));
    }

    const newPost = Post.create({ ..._.pick(body, ['title', 'body']), owner: user, imageUrl });
    await newPost.save();

    return res.json(newPost);
};

export const updatePost = async (req: PostByIdReq & ReqWithImageUrl, res: Response): Promise<Response> => {
    const { body, post, imageUrl } = req;

    try {
        await validUpdatePostSchema.validate(body, { abortEarly: false });
    } catch (err) {
        if (imageUrl) {
            fs.unlinkSync(path.join(uploadsDir, imageUrl));
        }
        return res.status(400).json(formatYupError(err));
    }

    const fieldsToUpdate = _.pick(body, ['title', 'body']);
    await Post.update(post.id, { ...fieldsToUpdate, updated: new Date(), imageUrl });

    return res.json({ ...post, ...fieldsToUpdate, imageUrl });
};

export const deletePost = async (req: PostByIdReq, res: Response): Promise<Response> => {
    await Post.delete({ id: req.post.id });
    return res.json({ message: 'Post deleted successfully' });
};
