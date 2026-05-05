import bcrypt from "bcrypt";
import crypto from "crypto";
import UserModel from "../models/user.model"
import UserTokenModel from "../models/userToken.model";

export const findUserByEmail = async (email: string) => {
    const user = await UserModel.findOne({ email });
    return user;
}

export const findUserById = async (id: string) => {
    const user = await UserModel.findById(id);
    return user;
}

export const createUser = async (fname: string, lname: string, email: string, password: string, role: "admin" | "patient" | "doctor") => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
        fname,
        lname,
        email,
        hashPassword: hashedPassword,
        role
    });

    if (!user) throw new Error("User creation failed");

    const rawToken = crypto.randomBytes(32).toString("hex"); // sent to user for verification
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex"); // stored in DB for verification

    await UserTokenModel.create({
        userId: user._id,
        token: hashedToken,
        tokenType: "Verification",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // token valid for 15 minutes        
    })

    return { user, rawToken };
}

export const verifyToken = async (token: string) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const userToken = await UserTokenModel.findOne({ token: hashedToken, tokenType: "Verification" });
    if (!userToken) throw new Error("Invalid or expired token");

    if (userToken.expiresAt < new Date()) {
        await UserTokenModel.deleteOne({ _id: userToken._id }); 
        await UserModel.findByIdAndDelete(userToken.userId);
        throw new Error("Token expired, please sign up again");
    } // Optionally, delete the token and user if token is expired to prevent clutter and security issues

    const user = await UserModel.findById(userToken.userId);
    if (!user) throw new Error("User not found");

    await user.updateOne({ isActive: true });
    await UserTokenModel.deleteOne({ _id: userToken._id }); // delete token after successful verification

    return user;
}