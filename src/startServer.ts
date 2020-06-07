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
    logger.info('$PORT: ', process.env.PORT);
    logger.info('$PORT: ', JSON.parse(port as string));
    logger.info('$PORT: ', Object.values(JSON.parse(port as string)));
    logger.info('$PORT: ', +Object.values(JSON.parse(port as string)).join());

    await createTypeormConn();

    app.listen(+port ? port : +Object.values(JSON.parse(port as string)).join());

    return app;
};
