import { AuthReq, ChannelByIdReq, UserByIdReq } from '../shared/constants/interfaces';
import { Response, NextFunction } from 'express';
import { validChannelSchema } from '../shared/validations';
import { formatYupError } from '../../utils/formatYupError';
import { Channel } from '../../entity';

export const channelById = async (
    req: ChannelByIdReq,
    res: Response,
    next: NextFunction,
    id,
): Promise<void | Response> => {
    let channel;
    try {
        channel = await Channel.findOne({ where: { id }, relations: ['owner', 'members'] });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Bad input' });
    }

    if (!channel) {
        return res.status(404).json({ error: 'Channel does not exist' });
    }

    req.channelById = channel;
    next();
};

export const getChannel = (req: ChannelByIdReq, res: Response): Response => {
    return res.json(req.channelById);
};

export const getMyChannels = async (req: AuthReq, res: Response): Promise<Response> => {
    const channels = await Channel.createQueryBuilder('channel')
        .innerJoinAndSelect('channel.members', 'members')
        .where('members.id = :userId', { userId: req.user.id })
        .select('channel')
        .getMany();

    //TODO do the same for own channels and merge it
    const ownChannels = await Channel.find({ owner: { id: req.user.id } });

    return res.json(ownChannels.concat(channels));
};

export const createChannel = async (req: AuthReq, res: Response): Promise<Response> => {
    const { body, user } = req;

    try {
        await validChannelSchema.validate(body, { abortEarly: false });
    } catch (err) {
        return res.status(400).json(formatYupError(err));
    }

    const channelAlreadyExists = await Channel.findOne({
        where: { tag: body.tag },
        select: ['id'],
    });

    if (channelAlreadyExists) {
        return res.status(401).json([
            {
                path: 'tag',
                message: 'This tag is taken already',
            },
        ]);
    }

    const channel = Channel.create(body);

    channel.owner = user;

    await channel.save();

    return res.json(channel);
};

export const addMemberToChannel = async (
    req: AuthReq & UserByIdReq & ChannelByIdReq,
    res: Response,
): Promise<Response> => {
    const { channelById, userById, user } = req;

    if (user.id === userById.id) {
        return res.status(400).json({ error: 'You are an owner of this channel' });
    }

    if (channelById.members.map(({ id }) => id).includes(userById.id)) {
        return res.status(400).json({ error: `User with id ${userById.id} is already member of this channel` });
    }

    channelById.members = channelById.members.length ? channelById.members.concat(userById) : [userById];

    await channelById.save();

    return res.json({ message: 'Success' });
};

export const leaveFromChannel = async (req: AuthReq & ChannelByIdReq, res: Response): Promise<Response> => {
    const { user, channelById } = req;
    channelById.members = channelById.members.filter(({ id }) => id !== user.id);

    await channelById.save();

    return res.json({ message: 'Success' });
};
export const kickOutFromChannel = async (
    req: AuthReq & UserByIdReq & ChannelByIdReq,
    res: Response,
): Promise<Response> => {
    const { userById, channelById } = req;
    channelById.members = channelById.members.filter(({ id }) => id !== userById.id);

    await channelById.save();

    return res.json({ message: 'Success' });
};

export const deleteChannel = async (req: AuthReq & ChannelByIdReq, res: Response): Promise<Response> => {
    const { channelById } = req;

    await Channel.delete({ id: channelById.id });

    return res.json({ message: 'Success' });
};
