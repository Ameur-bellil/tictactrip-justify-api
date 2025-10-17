import { IUser, UserModel } from "../models/user.model";

export class UserRepo {
    async createUser(email: string): Promise<IUser> {
        const user = new UserModel({
            email,
            totalWords: 0,
            lastReset: new Date(),
        });
        return user.save();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email });
    }

    async updateWordUsage(email: string, wordCount: number): Promise<void> {
        // Ne pas mettre à jour lastReset ici, seulement lors du reset
        await UserModel.updateOne(
            { email },
            { $inc: { totalWords: wordCount } },
            { upsert: true }
        );
    }

    async resetDailyLimit(email: string): Promise<void> {
        await UserModel.updateOne(
            { email },
            { $set: { totalWords: 0, lastReset: new Date() } }
        );
    }

    async getUserDetails(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email }).select("-_id email totalWords lastReset");
    }
}