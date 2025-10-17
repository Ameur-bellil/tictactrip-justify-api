import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserRepo } from "../repositories/user.repo";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../utils/custom.error";
import {IUser} from "../models/user.model";

export class AuthService {
    private repo: UserRepo;

    constructor(repo: UserRepo = new UserRepo()) {
        this.repo = repo;
    }

    public async generateToken(email: string): Promise<string> {
        // Vérifie si l'utilisateur existe
        let user = await this.repo.findByEmail(email);
        if (!user) {
            user = await this.repo.createUser(email);
        }
        // Génère un JWT
        return jwt.sign({ email }, env.JWT_SECRET!);
    }

    public async getUserDetails(email: string): Promise<IUser> {
        const user = await this.repo.findByEmail(email);
        if (!user) {
            throw new CustomError('User not found', StatusCodes.NOT_FOUND);
        }
        return user;
    }

    public async updateWordCount(email: string, wordCount: number): Promise<IUser> {
        const user = await this.repo.findByEmail(email);
        if (!user) {
            throw new CustomError('User not found', StatusCodes.NOT_FOUND);
        }

        // Vérifier si on doit réinitialiser (nouveau jour)
        const now = new Date();
        const lastReset = new Date(user.lastReset);
        const isNewDay = now.getDate() !== lastReset.getDate() ||
            now.getMonth() !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear();

        if (isNewDay) {
            await this.repo.resetDailyLimit(email);
            user.totalWords = wordCount;
            user.lastReset = now;
        } else {
            user.totalWords += wordCount;
        }

        await user.save();
        return user;
    }

    // public async checkDailyLimit(email: string, dailyLimit: number): Promise<boolean> {
    //     const user = await this.repo.findByEmail(email);
    //     if (!user) {
    //         throw new CustomError('User not found', StatusCodes.NOT_FOUND);
    //     }
    //
    //     // Vérifier si on doit réinitialiser
    //     const now = new Date();
    //     const lastReset = new Date(user.lastReset);
    //     const isNewDay = now.getDate() !== lastReset.getDate() ||
    //         now.getMonth() !== lastReset.getMonth() ||
    //         now.getFullYear() !== lastReset.getFullYear();
    //
    //     if (isNewDay) {
    //         await this.repo.resetDailyLimit(email);
    //         return true; // Limite OK après réinitialisation
    //     }
    //
    //     return user.totalWords < dailyLimit;
    // }
}