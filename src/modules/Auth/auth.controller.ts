import { Request, Response } from 'express';
import { v4 } from 'uuid';

import { formatYupError } from '../../utils/formatYupError';
import { validUserSchema } from '../shared/validations/user';
import { User } from '../../entity';
import { redis } from '../../redis';
import { emailTransporter } from '../../utils/emailTransporter';

export const me = (req: Request, res: Response) => {};

export const login = (req: Request, res: Response) => {};

export const sendForgotPasswordEmail = (req: Request, res: Response) => {};

export const changePassword = (req: Request, res: Response) => {};

export const registerUser = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await validUserSchema.validate(body, { abortEarly: false });
    } catch (err) {
        return res.status(400).json(formatYupError(err));
    }

    const { email } = body;

    const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
    });

    if (userAlreadyExists) {
        return res.status(403).json([
            {
                path: 'email',
                message: 'Email is taken already',
            },
        ]);
    }

    const user = User.create(body);
    await user.save();

    if (process.env.NODE_ENV !== 'test') {
        const id = v4();
        const userId = user.id;
        const url: string = process.env.API_BASE as string;
        await redis.set(id, userId, 'ex', 60 * 60 * 24);
        const confirmLink = `${url}/confirm/${id}`;
        console.log(`Confirm link for ${email} is ${confirmLink}`);
        emailTransporter.sendMail(
            {
                to: email,
                from: 'neople.neo.com',
                subject: 'Confirm Email',
                html: `<html lang="en">
                  <body>
                     <p>Thanks for the registration!</p>
                     <span>
                        Please confirm your email <a href="${confirmLink}">confirm email</a>
                     </span>
                  </body>
               </html>`,
            },
            (err, info) => {
                if (err) console.error(err);
                else console.log(info);
            },
        );
    }
    return res.json({ message: 'Registration success' });
};

export const confirmEmail = (req: Request, res: Response) => {};
