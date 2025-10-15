import { Options } from 'swagger-jsdoc';
import {env} from "./env";


const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My Node.js API with TypeScript',
            version: '1.0.0',
            description: 'A sample API documented with Swagger',
        },
        servers: [
            {
                url: `${env.BASE_URL}:${env.PORT}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Paths to files containing JSDoc comments
};

export default swaggerOptions;