import { AuthReq } from '../shared/constants/interfaces';
import { Response } from 'express';

export const subscribeToUser = async (req: AuthReq, res: Response): Promise<Response> => {
    const {
        user,
        params: { userId },
    } = req;

    // if (user.id === userById.id) {
    //     return res.status(400).json({ error: "You can't follow yourself" });
    // }
    //
    // const [{ following }] = await User.createQueryBuilder('user')
    //     .leftJoinAndSelect('user.following', 'following')
    //     .where('user.id = :userId', { userId: user.id })
    //     .getMany();
    //
    // console.log(following.map(({ id }) => id));
    // if (following.map(({ id }) => id).includes(userById.id)) {
    //     return res.status(401).json({ error: 'You follow this user already' });
    // }
    //
    // user.following.push(userById);
    // await user.save();

    return res.json({ message: 'Ok' });
};
