import { Router } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as swagger from 'swagger-jsdoc';

import { swaggerDocument } from './swaggerDocument';

export const swaggerRouter = Router();

const specs = swagger(swaggerDocument);

swaggerRouter.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
swaggerRouter.get('/swagger', swaggerUi.setup(specs, { explorer: true }));
