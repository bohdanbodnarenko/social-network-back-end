import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import * as path from 'path';

export const createTypeormConn = async (): Promise<Connection> => {
    if (process.env.NODE_ENV !== 'production') {
        const connectionOptions = await getConnectionOptions(process.env.NODE_ENV || 'test');
        return createConnection({
            ...connectionOptions,
            name: 'default',
        });
    }
    const dirname = path.join(__dirname, '..');
    return createConnection({
        name: 'default',
        type: 'postgres',
        database: process.env.TYPEORM_DATABASE || 'postgres',
        host: process.env.TYPEORM_HOST || 'localhost',
        port: +process.env.TYPEORM_PORT || 5432,
        username: process.env.TYPEORM_USERNAME || 'postgres',
        password: process.env.TYPEORM_PASSWORD || 'postgres',
        entities: [`${dirname}/entity/**/*.{ts,js}`],
        subscribers: [`${dirname}/subscriber/**/*.{ts,js}`],
        migrations: [`${dirname}/migration/**/*.{ts,js}`],
        logging: Boolean(process.env.TYPEORM_LOGGING) || true,
        synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE) || true,
        url: process.env.DATABASE_URL || 'localhost',
    });
};
