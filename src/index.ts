import {env} from "./config/env";
import express from 'express';
import swaggerOptions from './config/swagger';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRouter from "./routes/auth.route";
import justifyRouter from "./routes/justify.route";
import {connectMongo} from "./config/mongo";
import './config/redis';

const app = express();
app.use(express.text({ limit: "50mb" }));  // limit 50MB
app.use(express.json());

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', authRouter);
app.use('/api', justifyRouter);

async function startServer() {
    try {
        await connectMongo();
        const server = app.listen(env.PORT, () => {
            console.log(`[server]: Server running at ${env.BASE_URL}:${env.PORT}`);
            console.log(`[server]: Swagger docs available at ${env.BASE_URL}:${env.PORT}/api-docs/`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

export default app;