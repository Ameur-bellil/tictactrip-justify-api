import jwt, { JwtPayload } from "jsonwebtoken";
import {env} from "../config/env";

export class AuthService {
    static generateToken(email: string): string {
        return jwt.sign({ email }, env.JWT_SECRET!, { expiresIn: "24h" });
    }

}
