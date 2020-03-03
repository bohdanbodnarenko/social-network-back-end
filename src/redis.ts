import * as Redis from 'ioredis';

export const redis: Redis.Redis = new Redis(process.env.REDIS_URL);
