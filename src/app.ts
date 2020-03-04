import * as express from 'express';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as RateLimit from 'express-rate-limit';
import * as RateLimitRedisStore from 'rate-limit-redis';
import * as helmet from 'helmet';
import * as fileUpload from 'express-fileupload';

import { weblogger } from './utils/logger';
import { redis } from './redis';
import * as routes from './modules';
import { uploadsDir } from './modules/shared/constants/constants';

const RedisStore = connectRedis(session);

export const app = express();

if (process.env.NODE_ENV !== 'test') {
    app.use(weblogger);
    app.use(helmet());
}

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(express.static(uploadsDir));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    fileUpload({
        createParentPath: true,
    }),
);
app.use(express.static('uploads'));

app.use(
    fileUpload({
        createParentPath: true,
        limits: {
            fileSize: 4 * 1024 * 1024 * 1024, // 4MB max file size
        },
        abortOnLimit: true,
    }),
);

app.use(
    new RateLimit({
        store: new RateLimitRedisStore({
            client: redis,
        }),
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        delayMs: 0, // disable delaying - full speed until the max limit is reached
    }),
);

app.use(
    session({
        store: new RedisStore({
            client: redis,
            prefix: 'sess:',
        }),
        name: 'qid',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
    }),
);

for (const route of Object.values(routes)) {
    app.use('/', route);
}
