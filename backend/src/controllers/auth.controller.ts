import type { Request, Response, NextFunction } from "express";
import bcryptjs from 'bcryptjs';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import DoctorDetailsModel from "../models/doctorDetails.model";
import { createError } from "../middleware/error.middleware";
import { createUser, findUserByEmail, verifyToken } from "../services/auth.service";

interface JwtPayload {
    id: string;
}

export const signupController = async (req: Request, res: Response, nxt: NextFunction) => {
    try {
        const { fname, lname, email, password, role, phone, specialization, registrationNumber, dateOfBirth, gender } = req.body;

        const existinguser = await findUserByEmail(email);
        if (existinguser) {
            return nxt(createError("Email already registered", 400));
        };

        const { user, rawToken } = await createUser(fname, lname, email, password, role, phone);

        if (role === "doctor") {
            if (!specialization || !registrationNumber) {
                return nxt(createError('Specialization and registration number are required for doctors', 400));
            }
            await DoctorDetailsModel.create({ 
                userId: user._id,
                specialization,
                registrationNumber,
            });
        }

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

        // email sending logic here using nodemailer or any email service provider
        res.status(201).json({ message: "User created successfully, please verify your email" });
    } catch (err) {
        nxt(err);
    }
}

export const verifyEmailController = async (req: Request, res: Response, nxt: NextFunction) => {
    try {
        const { token } = req.params;

        if (!token || Array.isArray(token)) {
            return nxt(createError("Please provide a valid token", 400));
        }

        const user = await verifyToken(token);
        if (!user) return nxt(createError("Invalid or expired token", 400));

        // Optionally, you can generate a JWT token here for immediate login after verification
        
        res.status(200).json({ message: "Email verified successfully." });
    } catch (err) {
        nxt(err);
    }
}