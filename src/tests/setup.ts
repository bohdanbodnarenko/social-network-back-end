import { getConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import * as requests from 'supertest';

import { startServer } from '../startServer';

export let request: requests.SuperTest<any>;

beforeAll(async () => {
    dotenv.config();
    const app = await startServer();
    request = requests(app);
});

afterAll(async () => {
    dotenv.config();
    getConnection().close();
    setTimeout(() => process.exit(), 1000);
});
