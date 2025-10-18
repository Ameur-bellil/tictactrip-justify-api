export const env = {
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    MONGO_URI: process.env.MONGO_URI,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: parseInt(process.env.REDIS_PORT!),
    JWT_SECRET: process.env.JWT_SECRET!,
};


console.log('[env] MONGO_URI:', env.MONGO_URI);
console.log('[env] REDIS_HOST:', env.REDIS_HOST);