import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

 /**
 * Middleware pour vérifier le JWT dans l'header Authorization
 **/

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Missing token" });
    }


    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    const payload = AuthService.verifyToken(token);
    if (!payload) return res.status(401).json({ error: "Invalid or expired token" });


    (req as any).user = payload;

    next();
};
