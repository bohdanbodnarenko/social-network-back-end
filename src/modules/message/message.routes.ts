import { Router } from 'express';

import { channelById } from '../channel/channel.controller';
import { isAuth, isChannelMember, isMessageOwner } from '../shared/middlewares';
import { createMessage, deleteMessages, getMessages, messageById, updateMessage } from './message.controller';

export const messageRouter = Router();

messageRouter.param('channelId', channelById);
messageRouter.param('messageId', messageById);

messageRouter.post('/message/:channelId', isAuth, isChannelMember, createMessage);

messageRouter.get('/message/all/:channelId', isAuth, isChannelMember, getMessages);

messageRouter.put('/message/:messageId', isAuth, isMessageOwner, updateMessage);

messageRouter.delete('/message', isAuth, deleteMessages);
