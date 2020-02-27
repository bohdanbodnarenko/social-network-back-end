import { startServer } from './startServer';
import { logger } from './utils/logger';

// TODO fix build in package.json
startServer().then(() => {
    logger.info(`🚀 Server is running on ${process.env.API_BASE} 🚀`);
});
