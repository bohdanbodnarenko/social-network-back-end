import * as Redis from 'ioredis';

export const redis: Redis.Redis = new Redis(6379);
