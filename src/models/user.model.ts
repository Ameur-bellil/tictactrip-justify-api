import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    totalWords: number;
    lastReset: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    totalWords: { type: Number, default: 0 },
    lastReset: { type: Date, default: () => new Date() },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
