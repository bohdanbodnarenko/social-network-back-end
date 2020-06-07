import 'dotenv/config';
import 'reflect-metadata';
import { Application } from 'express';

import { redis } from './redis';
import { app } from './app';
import { createTypeormConn, logger } from './utils';

export const startServer = async (): Promise<Application> => {
    if (process.env.NODE_ENV === 'test') {
        await redis.flushall();
    }

    const port = process.env.PORT || 4000;
    logger.info('$PORT: ', port.toString());

    await createTypeormConn();

    app.listen(process.env.PORT);

    return app;
};
