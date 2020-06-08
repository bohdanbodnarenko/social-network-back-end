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

    const port = process.env.PORT || '4000';
    const host = process.env.HOST || '0.0.0.0';

    await createTypeormConn();

    app.listen(+port, host, e => {
        if (e) {
            logger.error(e);
        }
        logger.info(`Listening on ${host}:${port}`);
    });

    return app;
};
