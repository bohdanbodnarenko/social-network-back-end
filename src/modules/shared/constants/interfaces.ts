import { Request } from 'express';

import { User } from '../../../entity';

export interface AuthReq extends Request {
    user: User;
    token: string;
}
