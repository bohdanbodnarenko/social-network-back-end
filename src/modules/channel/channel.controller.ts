import { AuthReq, ChannelByIdReq } from '../shared/constants/interfaces';
import { Response, NextFunction } from 'express';
import { validChannelSchema } from '../shared/validations';
import { formatYupError } from '../../utils/formatYupError';
import { Channel} from '../../entity';

export const channelById = async (
    req: ChannelByIdReq,
    res: Response,
    next: NextFunction,
    id,
): Promise<void | Response> => {
    const channel = await Channel.findOne({ where: { id }, relations: ['owner'] });

    if (!channel) {
        return res.status(404).json({ error: 'Channel does not exist' });
    }

    req.channelById = channel;
    next();
};

export const getChannel = (req: ChannelByIdReq, res: Response) => {
    return res.json(req.channelById);
};

export const getMyChannels = async (req: AuthReq, res: Response): Promise<Response> => {
    const channels = await Channel.createQueryBuilder('channel')
        .innerJoinAndSelect('channel.members', 'user')
        .where('user.id = :id', { id: req.user.id })
        .getMany();

    //TODO do the same for own channels and merge it
    console.log(channels);

    return res.json(channels);
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
        return res.status(400).json([
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
