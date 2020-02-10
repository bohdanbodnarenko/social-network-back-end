import { Request } from 'express';

import { Channel, User } from '../../../entity';

// USER
export interface AuthReq extends Request {
    user: User;
    token: string;
}

export interface UserByIdReq extends Request {
    userById: User;
}

//CHANNEL

export interface ChannelByIdReq extends Request {
    channelById: Channel;
}
