import express from 'express';
import swaggerOptions from './config/swagger';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {env} from "./config/env";

const app = express();
app.use(express.text());
app.use(express.json());

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(env.PORT, () => {
    console.log(`[server]: Server is running at ${env.BASE_URL}:${env.PORT}`);
    console.log(`Swagger docs available at ${env.BASE_URL}:${env.PORT}/api-docs`);
});