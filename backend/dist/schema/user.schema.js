import { z } from "zod";
const GENDER_OPTIONS = ["male", "female", "other"];
export const registerSchema = z.object({
    firstName: z
        .string({ message: "First name is required" })
        .min(1, "First name is required")
        .max(50, "First name cannot exceed 50 characters")
        .trim(),
    middleName: z
        .string()
        .max(50, "Middle name cannot exceed 50 characters")
        .trim()
        .optional(),
    lastName: z
        .string()
        .max(50, "Last name cannot exceed 50 characters")
        .trim()
        .optional(),
    email: z
        .email({ message: "Please enter a valid email address" })
        .trim()
        .toLowerCase(),
    password: z
        .string({ message: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[$@/]/, "Password must contain at least one special character ($ @ /)"),
    phone: z
        .string()
        .trim()
        .regex(/^\+\d{1,4}-\d{6,14}$/, "Phone number must be in format: +CountryCode-Number (e.g. +91-6389949510)")
        .optional(),
    dateOfBirth: z.coerce.date().optional(),
    gender: z.enum(GENDER_OPTIONS, {
        message: "Gender must be male, female, or other",
    }),
});
export const loginSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .trim()
        .toLowerCase(),
    password: z
        .string({ message: "Password is required" })
        .min(1, "Password is required"),
});
//# sourceMappingURL=user.schema.js.map