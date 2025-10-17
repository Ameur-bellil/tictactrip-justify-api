import { Request, Response, NextFunction } from "express";
import { rateLimitMiddleware } from "../src/middlewares/ratelimit.middleware";
import { AuthService } from "../src/services/auth.service";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../src/utils/custom.error";

jest.mock("../src/services/auth.service");

const mockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe("rateLimitMiddleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = { locals: { user: { email: "test@example.com" } } };
        next = jest.fn();
    });

    it("should return 400 if text is missing", async () => {
        req.body = "";
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();

        await rateLimitMiddleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith({
            error: "No text provided or invalid format",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if user is under the word limit", async () => {
        req.body = "Un texte valide";

        // Mock complet pour IUser avec Partial<IUser>
        mockedAuthService.prototype.getUserDetails.mockResolvedValue({
            email: "test@example.com",
            totalWords: 1000,
            lastReset: new Date(),
        } as Partial<any> as any);

        // Mock updateWordCount
        mockedAuthService.prototype.updateWordCount.mockResolvedValue(undefined as any);

        // Appel du middleware
        await rateLimitMiddleware(req as Request, res as Response, next);

        // Vérifie que next() a été appelé
        expect(next).toHaveBeenCalled();
    });


    it("should call next with CustomError if word limit exceeded", async () => {
        req.body = "Un mot";

        mockedAuthService.prototype.getUserDetails.mockResolvedValue({
            email: "test@example.com",
            totalWords: 80000, // limite quotidienne atteinte
            lastReset: new Date(),
        } as Partial<any> as any);

        await rateLimitMiddleware(req as Request, res as Response, (err?: any) => {
            expect(err).toBeInstanceOf(CustomError);
            expect(err.message).toBe("Payment required");
            expect(err.statusCode).toBe(StatusCodes.PAYMENT_REQUIRED);
        });
    });
});
