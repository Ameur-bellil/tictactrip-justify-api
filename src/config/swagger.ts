import { Options } from 'swagger-jsdoc';
import {env} from "./env";
import path from "node:path";


const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Text Justifier API',
            version: '1.0.0',
            description: 'API REST pour justifier du texte',
        },
        servers: [
            {
                url: `${env.BASE_URL}:${env.PORT}`,
                description: 'Development server',
            },
            {
                url: 'http://api-justify-tictac.francecentral.cloudapp.azure.com:8080', // Azure VM / prod
                description: 'Production server (Azure)',
            },
        ],
    },
    apis: [path.join(__dirname, '../../src/routes/*.ts')] ,// Path to the API docs
};

export default swaggerOptions;