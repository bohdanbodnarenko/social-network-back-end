import 'dotenv/config';
import 'reflect-metadata';
import { Application } from 'express';

import { redis } from './redis';
import { createTypeormConn } from './utils/createTypeormConn';
import { app } from './app';

export const startServer = async (): Promise<Application> => {
    if (process.env.NODE_ENV === 'test') {
        await redis.flushall();
    }

    const port = process.env.PORT || 4000;

    await createTypeormConn();

    app.listen(port);

    return app;
};
