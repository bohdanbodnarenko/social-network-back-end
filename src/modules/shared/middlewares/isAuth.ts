import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { User } from '../../../entity';
import { AuthReq } from '../constants/interfaces';

export const isAuth = async (req: AuthReq, res: Response, next: NextFunction): Promise<Response | void> => {
    if (!req.header('Authorization')) {
        return res.status(403).json({ error: 'Not authenticated' });
    }
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ error: 'Authentication error, please login again' });
    }

    try {
        const { id } = verify(token, process.env.JWT_SECRET as string);
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(403).json({ error: 'Wrong access token' });
        }
        delete user.password;
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Not authorized to access this resource' });
    }
};
