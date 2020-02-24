import { NextFunction, Response, Request } from 'express';
import * as _ from 'lodash';

import { User } from '../../entity';
import { UserByIdReq, AuthReq } from '../shared/constants/interfaces';

export const userById = async (
    req: UserByIdReq,
    res: Response,
    next: NextFunction,
    id: string,
): Promise<void | Response> => {
    if (!+id) {
        return res.status(400).json({ error: 'Not valid user id' });
    }
    const user = await User.findOne({ id: +id });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    user.password = undefined;
    req.userById = user;
    next();
};

export const getUser = (req: UserByIdReq, res: Response): Response => res.json(req.userById);

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const { offset, limit } = req.query;
    return res.json(await User.find({ skip: +offset || 0, take: +limit || 50 }));
};

export const updateUser = async (req: AuthReq, res: Response): Promise<Response> => {
    const {
        user: { id, ...user },
        body,
    } = req;

    const allowedFieldsToChange = ['firstName', 'lastName', 'dateOfBirth', 'about'];

    const updatedUser = _.pick(body, allowedFieldsToChange);
    let isUserSame = true;

    for (const key of allowedFieldsToChange) {
        if (updatedUser[key] !== user[key]) {
            isUserSame = false;
            break;
        }
    }

    if (isUserSame) {
        return res.json({ id, ...user });
    }

    await User.update({ id }, { ...updatedUser });

    const newUser = await User.findOne(id);
    delete newUser.password;

    return res.json(newUser);
};
