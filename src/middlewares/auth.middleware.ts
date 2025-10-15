import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ error: "Missing token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Invalid token format" });
    }

    try {
        jwt.verify(token, env.JWT_SECRET!);
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
