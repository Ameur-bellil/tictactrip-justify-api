import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {CustomError} from "../utils/custom.error";
import jwt, {JwtPayload} from "jsonwebtoken";
import {env} from "../config/env";

function verifyToken(token: string): JwtPayload | string {
    try {
        return jwt.verify(token, env.JWT_SECRET)
    } catch (error) {
        throw new CustomError('invalid or expired token', StatusCodes.UNAUTHORIZED);
    }
}

export const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError("Authorization header missing or malformed", StatusCodes.UNAUTHORIZED);
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    res.locals.user = decoded;
    next();
};


