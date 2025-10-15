import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthDto } from "../dtos/auth.dto";

export class AuthController {
    static getToken(req: Request, res: Response) {
        try {

            const { email } = AuthDto.parse(req.body);
            const token = AuthService.generateToken(email);
            res.json({ token });

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
