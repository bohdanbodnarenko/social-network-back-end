import { Request, Response } from 'express';
import { v4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

import { validLoginSchema, validPasswordSchema, validUserSchema } from '../shared/validations/';
import { User } from '../../entity';
import { redis } from '../../redis';
import { emailTransporter, formatYupError } from '../../utils';
import { AuthReq, ReqWithImageUrl } from '../shared/constants/interfaces';
import { confirmEmailPrefix, forgotPasswordPrefix, uploadsDir } from '../shared/constants/constants';
import { UpdateResult } from 'typeorm';

const sendConfirmationMail = async (userId: number, email: string): Promise<void> => {
    const id = v4();
    const url: string = process.env.API_BASE as string;
    await redis.set(confirmEmailPrefix + id, userId, 'ex', 60 * 60 * 24);
    const confirmLink = `${url}/confirm/${id}`;
    console.log(`Confirm link for ${email} is ${confirmLink}`);
    if (process.env.NODE_ENV !== 'test') {
        emailTransporter.sendMail(
            {
                to: email,
                from: 'peocon.com',
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
};

export const me = (req: AuthReq, res: Response): Response => res.json(req.user);

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { body } = req;
    try {
        await validLoginSchema.validate(body, { abortEarly: false });
    } catch (err) {
        return res.status(400).json(formatYupError(err));
    }
    const { email, password } = body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json([
            {
                path: 'email',
                message: 'User with this email does not exits, please sign up',
            },
        ]);
    }

    if (!user.confirmed) {
        return res.status(403).json([
            {
                path: 'email',
                message: 'Please confirm your email first',
            },
        ]);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.status(400).json([{ path: 'password', message: 'Wrong password' }]);
    }

    user.password = undefined;

    const token = jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '2 days' },
    );

    return res.json({
        user,
        token,
    });
};

export const sendForgotPasswordEmail = async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            path: 'email',
            message: 'User with this email does not exist',
        });
    }

    await User.update({ id: user.id }, { forgotPasswordLocked: true });

    const id = v4();
    await redis.set(`${forgotPasswordPrefix}${id}`, user.id, 'ex', 60 * 20);

    const recoverLink = `${process.env.FRONTEND_HOST}/forgot-password/${id}`;
    console.log(`Recover password link for user ${email}: ${recoverLink}`);

    emailTransporter.sendMail(
        {
            to: email,
            from: 'support@shopohavat.com',
            subject: 'Password recovering',
            html: `<html lang="en">
                  <body>
                     <p>Shopohavat password recovering</p>
                     <a href="${recoverLink}">Recover password</a>
                  </body>
               </html>`,
        },
        (err, info) => {
            if (err) console.error(err);
            else console.log(info);
        },
    );
    return res.json({ message: 'Please check your email for the next steps' });
};

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
    const { key } = req.params;
    const { password } = req.body;
    const redisKey = `${forgotPasswordPrefix}${key}`;

    const userId = await redis.get(redisKey);

    if (!userId) {
        return res.status(400).json([
            {
                path: 'password',
                message: 'Key was expired, please try again',
            },
        ]);
    }

    try {
        await validPasswordSchema.validate({ password }, { abortEarly: false });
    } catch (err) {
        return res.status(400).json(formatYupError(err));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatePromise = User.update(
        { id: +userId },
        {
            forgotPasswordLocked: false,
            password: hashedPassword,
        },
    );

    const deleteKeyPromise = redis.del(redisKey);

    await Promise.all([updatePromise, deleteKeyPromise]);

    return res.json({ message: 'Password successfully changed' });
};

export const sendConfirmationAgain = async (req: Request, res: Response): Promise<Response> => {
    const {
        body: { email },
    } = req;
    if (!email) {
        return res.status(400).json([{ path: 'email', message: 'Please provide an email' }]);
    }
    const user = await User.findOne({
        where: { email },
    });

    if (!user) {
        return res.status(400).json([
            {
                path: 'email',
                message: 'User with this email does not exist, please register first',
            },
        ]);
    }

    if (user.confirmed) {
        return res.status(400).json([
            {
                path: 'email',
                message: 'Your user is confirmed already',
            },
        ]);
    }

    await sendConfirmationMail(user.id, email);

    return res.json({ message: 'Confirmation successfully sent' });
};

export const registerUser = async (req: ReqWithImageUrl, res: Response): Promise<Response> => {
    const { body, imageUrl } = req;

    try {
        await validUserSchema.validate(body, { abortEarly: false });
    } catch (err) {
        if (imageUrl) {
            fs.unlinkSync(path.join(uploadsDir, imageUrl));
        }
        return res.status(400).json(formatYupError(err));
    }

    const { email } = body;

    const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
    });

    if (userAlreadyExists) {
        if (imageUrl) {
            fs.unlinkSync(path.join(uploadsDir, imageUrl));
        }
        return res.status(403).json([
            {
                path: 'email',
                message: 'Email is taken already',
            },
        ]);
    }

    const user = User.create({ ...body, imageUrl }) as any;
    await user.save();

    await sendConfirmationMail(user.id, email);

    return res.json({ message: 'Registration success' });
};

export const confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const userId = await redis.get(confirmEmailPrefix + id);

    if (userId) {
        const promises: Promise<UpdateResult | number>[] = [];

        promises.push(User.update({ id: +userId }, { confirmed: true }));
        promises.push(redis.del(id));

        await Promise.all(promises);

        return res.send({ message: 'ok' });
    } else {
        return res.status(400).send({ error: 'invalid' });
    }
};
