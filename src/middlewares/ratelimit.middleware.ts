import {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {AuthService} from "../services/auth.service";

const MAX_WORDS_PER_DAY = 80000;
const authService = new AuthService();

export const rateLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const text = req.body;
    const user = res.locals.user;

    if (!text || typeof text !== "string" || text.trim() === "") {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "No text provided or invalid format" });
    }

    const userDetails = await authService.getUserDetails(user.email);
    const wordCount = text.split(/\s+/).length;

    if (userDetails && userDetails.totalWords + wordCount > MAX_WORDS_PER_DAY) {
       return res
            .status(StatusCodes.PAYMENT_REQUIRED)
            .json({ error: "Payment required" });
    } else {
        await authService.updateWordCount(user.email, wordCount);
        next();
    }
};