
import { Request, Response } from "express";

import userModel from "../db/mongodb/user/user.model.js";
import otpModel from "../db/mongodb/otp/otp.model.js";

import hashService from "../services/hash.js";
import jwtService from "../services/jwt.js";
import sendEmail from "../services/email.js";


type Gender = "male" | "female" | "other";


const avatarMap: Record<Gender, string> = {
    male: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSENR1KLZzIFB6aG-0CUvDNjvNCDc9Vnhj4JUJau2kJRg&s=10",

    female: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdocfNblhrKpFvdWYm15zCN_Uuk3mATJ1Fmm-pAgv8sQ&s=10",

    other: "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
};


const getAvatar = (gender: Gender): string => {
    return avatarMap[gender];
};


// ======================================================
// LOGIN CONTROLLER
// ======================================================

export const loginController = async (
    req: Request,
    res: Response
) => {

    try {

        const { email, password } = req.body;


        // 1. Find user
        const user = await userModel
            .findOne({ email })
            .select("+password");


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered!, Please first register",
            });
        }


        // 2. Compare password
        const isPasswordMatch =
            await hashService.compareHashedPassword(
                password,
                user.password
            );


        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password!",
            });
        }


        // 3. Create access token
        const accessToken =
            jwtService.createAccessToken(
                user._id.toString()
            );


        // 4. Store token in cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });


        // 5. Remove password from response
        const {
            password: _,
            ...userResponse
        } = user.toObject();


        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: userResponse,
            },
        });

    } catch (err) {

        console.error(
            `Login user error: ${
                err instanceof Error
                    ? err.message
                    : "Unknown error"
            }`
        );

        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in",
        });
    }
};


// ======================================================
// REGISTER CONTROLLER
// ======================================================

export const registerController = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            firstName,
            lastName,
            email,
            password,
            gender,
        } = req.body;


        // 1. Check if user already exists
        const existingUser = await userModel.findOne({
            email,
        });


        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }


        // 2. Hash password
        const passwordHash =
            await hashService.hashingPassword(password);


        // 3. Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();


        // 4. Generate avatar
        const avatar = getAvatar(gender);


        // 5. Store temporary registration
        await otpModel.findOneAndUpdate(
            { email },
            {
                firstName,
                lastName,
                email,
                passwordHash,
                gender,
                avatar,
                otp,
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );


        // 6. Send OTP email
        const emailResult = await sendEmail(
            email,
            `Your verification code is ${otp}`,
            "otp"
        );


        // 7. Check whether email was sent
        if (!emailResult.success) {

            // Remove temporary registration
            await otpModel.deleteOne({ email });

            return res.status(500).json({
                success: false,
                message: "Failed to send verification email",
            });
        }


        // 8. Registration initiated
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (err) {

        console.error(
            `Register user error: ${
                err instanceof Error
                    ? err.message
                    : "Unknown error"
            }`
        );

        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering",
        });
    }
};


// ======================================================
// VERIFY OTP CONTROLLER
// ======================================================

export const verifyOtpController = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            email,
            otp,
        } = req.body;


        // 1. Find temporary registration
        const pendingUser = await otpModel.findOne({
            email,
        });


        if (!pendingUser) {
            return res.status(404).json({
                success: false,
                message: "Registration not found",
            });
        }


        // 2. Verify OTP
        if (pendingUser.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }


        // 3. Check if user already exists
        const existingUser = await userModel.findOne({
            email,
        });


        if (existingUser) {

            // Delete temporary registration
            await otpModel.deleteOne({
                _id: pendingUser._id,
            });

            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }


        // 4. Create permanent user
        const user = await userModel.create({
            firstName: pendingUser.firstName,

            lastName: pendingUser.lastName,

            email: pendingUser.email,

            // passwordHash from temporary collection
            // becomes password in User collection
            password: pendingUser.passwordHash,

            gender: pendingUser.gender,

            avatar: pendingUser.avatar,

            // OTP successfully verified email
            isEmailVerified: true,
        });


        // 5. Delete temporary registration
        await otpModel.deleteOne({
            _id: pendingUser._id,
        });


        // 6. Remove password from response
        const {
            password: _,
            ...userResponse
        } = user.toObject();


        // 7. Registration successful
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                user: userResponse,
            },
        });

    } catch (err) {

        console.error(
            `OTP verification error: ${
                err instanceof Error
                    ? err.message
                    : "Unknown error"
            }`
        );

        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying OTP",
        });
    }
};

