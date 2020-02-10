import * as dotenv from 'dotenv';
import * as requests from 'supertest';

import { startServer } from '../startServer';

export let request: requests.SuperTest<any>;
let inited = false;
beforeAll(async () => {
    dotenv.config();

    if (!inited) {
        const app = await startServer();
        request = requests(app);
        inited = true;
    }
});

// afterAll(async () => {
//     dotenv.config();
//     // getConnection().close();
//     // setTimeout(() => process.exit(), 1000);
// });
