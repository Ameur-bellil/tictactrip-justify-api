import Redis from "ioredis";
import {env} from "./env";

export const redisClient = new Redis({
    host: env.REDIS_HOST || "localhost",
    port: Number(env.REDIS_PORT) || 6379,
});

redisClient.on('connect', () => {
    console.log('[Redis Memory cache]: Connected successfully ');
});

redisClient.on('error', (error) => {
    console.error('[Redis Memory cache]: Redis connection error:', error);
});

export default redisClient;