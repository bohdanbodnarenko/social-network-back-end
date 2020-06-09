import { Connection, ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';
import * as path from 'path';

export const createTypeormConn = async (): Promise<Connection> => {
    const dirname = path.join(__dirname, '..');
    const prodOptions: ConnectionOptions = {
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
    };
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV || 'test');
    return createConnection({
        name: 'default',
        ...(process.env.NODE_ENV === 'production' ? prodOptions : connectionOptions),
    });
};
