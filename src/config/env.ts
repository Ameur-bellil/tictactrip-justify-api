// src/config/env.ts
export const env = {
    PORT: process.env.PORT || 8080,
    BASE_URL: process.env.BASE_URL || 'http://localhost',
    MONGO_URI: process.env.MONGO_URI,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
    JWT_SECRET: process.env.JWT_SECRET!,
    WORD_LIMIT: parseInt(process.env.WORD_LIMIT || '80000')
};

// Debug: afficher les variables au démarrage
console.log('[env] MONGO_URI:', env.MONGO_URI);
console.log('[env] REDIS_HOST:', env.REDIS_HOST);