import { Connection, createConnection, getConnection } from 'typeorm';
import * as dotenv from 'dotenv';

beforeAll(async () => {
    dotenv.config();
    const connection = await createConnection('test');
});

afterAll(async () => {
    dotenv.config();
    await getConnection().close();
});
