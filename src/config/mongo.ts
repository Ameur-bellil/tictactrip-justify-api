import mongoose from "mongoose";
import { env } from "./env";

export async function connectMongo() {
    if (!env.MONGO_URI) throw new Error("MONGO_URI is not defined");
    try {
        await mongoose.connect(env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000 // timeout optionnel
        });
        console.log(`[Database] MongoDB connected successfully ${env.MONGO_URI}`);
    } catch (err) {
        console.error("[Database] MongoDB connection error:", err);
        throw err;
    }
}
