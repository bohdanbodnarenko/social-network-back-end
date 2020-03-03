import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export const createTypeormConn = async (): Promise<Connection> => {
    const connectionOptions = await getConnectionOptions(
        process.env.NODE_ENV === 'production' ? undefined : process.env.NODE_ENV || 'test',
    );
    return createConnection({ ...connectionOptions, name: 'default' });
};
