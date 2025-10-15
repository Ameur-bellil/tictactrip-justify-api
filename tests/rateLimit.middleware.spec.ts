import { Request, Response, NextFunction } from "express";
import { rateLimit } from "../src/middlewares/ratelimit.middleware";

describe("RateLimit Middleware", () => {
    let req: any; // cast any pour bypasser TS
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        // Reset le compteur interne (Map) avant chaque test
        (rateLimit as any).usageMap = new Map();

        req = { user: { email: "test@example.com" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should call next if under limit", () => {
        req.body = "word ".repeat(1000); // 1000 mots
        rateLimit(req, res as any, next);
        expect(next).toHaveBeenCalled();
    });

    it("should return 402 if limit exceeded", () => {
        req.body = "word ".repeat(81000); // dépassement 80k mots
        rateLimit(req, res as any, next);
        expect(res.status).toHaveBeenCalledWith(402);
        expect(res.json).toHaveBeenCalledWith({error: "Payment Required",});
        expect(next).not.toHaveBeenCalled();
    });


    it("should accumulate words per user", () => {
        req.body = "word ".repeat(50000);
        rateLimit(req, res as any, next); // 50k
        req.body = "word ".repeat(30000);
        rateLimit(req, res as any, next); // 30k
        req.body = "word ".repeat(1000);
        rateLimit(req, res as any, next); // dépasse 80k
        expect(res.status).toHaveBeenCalledWith(402);
    });
});
