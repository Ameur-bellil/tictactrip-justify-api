import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {AuthService} from "../services/auth.service";
import {CustomError} from "../utils/custom.error";


const MAX_WORDS_PER_DAY = 80000;

const authService = new AuthService();
export const rateLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const text = req.body;
    const user = res.locals.user;

    if (!text) {
        throw new CustomError('Text is required', StatusCodes.BAD_REQUEST);
    }

    const userDetails = await authService.getUserDetails(user.email);
    const wordCount = text.split(/\s+/).length;

    if (userDetails && userDetails.totalWords + wordCount > MAX_WORDS_PER_DAY) {
        next(new CustomError('Payment required', StatusCodes.PAYMENT_REQUIRED));
    } else {
        await authService.updateWordCount(user.email, wordCount);
        next();
    }
};