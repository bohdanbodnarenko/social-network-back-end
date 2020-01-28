import { Router } from 'express';

import { channelById, createChannel, getChannel, getMyChannels } from './channel.controller';
import { isAuth } from '../shared/middlewares/isAuth';
import { isChannelMember } from '../shared/middlewares/isChannelMember';

export const channelRouter = Router();

channelRouter.param('channelId', channelById);

channelRouter.post('/channel', isAuth, createChannel);

// channelRouter.get('/user/all', getUsers);
channelRouter.get('/channel/my', isAuth, getMyChannels);
channelRouter.get('/channel/:channelId', isAuth, isChannelMember, getChannel);

// channelRouter.put('/user', isAuth, updateUser);
