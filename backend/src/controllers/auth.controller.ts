import type { Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, verifyToken } from "../services/auth.service";

interface JwtPayload {
    id: string;
}

export const signupController = async (req: Request, res: Response) => {
    try {
        const { fname, lname, email, password, role } = req.body;

        const existinguser = await findUserByEmail(email);
        if (existinguser) {
            return res.status(400).json({ message: "User already exists" });
        };

        const { user, rawToken } = await createUser(fname, lname, email, password, role);

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

        // email sending logic here using nodemailer or any email service provider
        res.status(201).json({ message: "User created successfully, please verify your email" });
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
}

export const verifyEmailController = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token || Array.isArray(token)) {
            return res.status(400).json({ message: "Please provide a valid token" });
        }

        const user = await verifyToken(token);
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        // Optionally, you can generate a JWT token here for immediate login after verification
        
        res.status(200).json({ message: "Email verified successfully." });
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
}