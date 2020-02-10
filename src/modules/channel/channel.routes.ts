import { Router } from 'express';

import {
    addMemberToChannel,
    channelById,
    createChannel,
    deleteChannel,
    getChannel,
    getMyChannels,
    kickOutFromChannel,
    leaveFromChannel,
} from './channel.controller';
import { isAuth } from '../shared/middlewares/isAuth';
import { isChannelMember } from '../shared/middlewares/isChannelMember';
import { userById } from '../user/user.controller';
import { isChannelOwner } from '../shared/middlewares/isChannelOwner';

export const channelRouter = Router();

channelRouter.param('channelId', channelById);
channelRouter.param('userId', userById);

channelRouter.post('/channel', isAuth, createChannel);
channelRouter.post('/channel/:channelId/leave', isAuth, isChannelMember, leaveFromChannel);
channelRouter.post('/channel/:channelId/kickout/:userId', isAuth, isChannelOwner, kickOutFromChannel);
channelRouter.post('/channel/:channelId/addMember/:userId', isAuth, isChannelOwner, addMemberToChannel);

channelRouter.get('/channel/my', isAuth, getMyChannels);
channelRouter.get('/channel/:channelId', isAuth, isChannelMember, getChannel);

channelRouter.delete('/channel/:channelId', isAuth, isChannelOwner, deleteChannel);
