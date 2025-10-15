import express from 'express';
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.text());
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
