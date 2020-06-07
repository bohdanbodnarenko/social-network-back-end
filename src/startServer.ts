import 'dotenv/config';
import 'reflect-metadata';
import { Application } from 'express';

import { redis } from './redis';
import { app } from './app';
import { createTypeormConn } from './utils';

export const startServer = async (): Promise<Application> => {
    if (process.env.NODE_ENV === 'test') {
        await redis.flushall();
    }

    const port = process.env.PORT || '4000';

    await createTypeormConn();

    app.listen(+port, () => console.log(`Listening on ${port}`));

    return app;
};
