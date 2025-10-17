import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {CustomError} from "../utils/custom.error";
import jwt, {JwtPayload} from "jsonwebtoken";
import {env} from "../config/env";

function verifyToken(token: string): JwtPayload | string {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        throw new CustomError("Invalid or expired token", StatusCodes.UNAUTHORIZED);
    }
}

export const authenticateMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ error: "Missing token" });
        }

        const token = authHeader.split(" ")[1];
        res.locals.user = verifyToken(token);
        next();
    } catch (err) {
        if (err instanceof CustomError) {
            return res.status(err.statusCode).json({ error: err.message });
        }
        console.error(err);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Internal server error" });
    }
};


