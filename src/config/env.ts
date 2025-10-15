import dotenv from 'dotenv';
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
    BASE_URL: process.env.BASE_URL,
    PORT: process.env.PORT,
};

