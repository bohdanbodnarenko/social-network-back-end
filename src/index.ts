import { startServer } from './startServer';
import { logger } from './utils';

startServer().then(() => {
    logger.info(`🚀 Server is running on ${process.env.API_BASE} 🚀`);
});
