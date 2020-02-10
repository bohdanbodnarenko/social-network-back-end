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
        const provider = await User.findOne({ id });
        if (!provider) {
            return res.status(403).json({ error: 'Wrong access token' });
        }
        delete provider.password;
        req.user = provider;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Not authorized to access this resource' });
    }
};
