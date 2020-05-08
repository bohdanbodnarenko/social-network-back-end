import * as fs from 'fs';
import * as path from 'path';
import { NextFunction, Response, Request } from 'express';
import * as _ from 'lodash';

import { User } from '../../entity';
import { UserByIdReq, AuthReq, ReqWithImageUrl } from '../shared/constants/interfaces';
import { shortUserFields, uploadsDir } from '../shared/constants/constants';
import { validUpdateUserSchema } from '../shared/validations';
import { formatYupError } from '../../utils/';

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
    // const { offset, limit } = req.query;
    const users = await User
        .find
        // { skip: +offset || 0, take: +limit ? (limit < 100 ? limit : 100) : 50 }
        ();
    return res.json(users.map(user => _.pick(user, shortUserFields)));
};

export const updateUser = async (req: AuthReq & ReqWithImageUrl, res: Response): Promise<Response> => {
    const {
        user: { id, ...user },
        body,
        imageUrl,
    } = req;

    try {
        await validUpdateUserSchema.validate(body, { abortEarly: false });
    } catch (err) {
        if (imageUrl) {
            fs.unlinkSync(path.join(uploadsDir, imageUrl));
        }
        return res.status(400).json(formatYupError(err));
    }

    const allowedFieldsToChange = ['firstName', 'lastName', 'dateOfBirth', 'about', 'imageUrl'];

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

    await User.update({ id }, { ...updatedUser, imageUrl });

    const newUser = await User.findOne(id);
    delete newUser.password;

    return res.json(newUser);
};
