import { startServer } from '../startServer';

export default async () => {
    console.log('Setting tests up...');
    await startServer();
};
