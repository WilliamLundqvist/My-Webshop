import { z } from 'zod';

// Validation schema för registeringsformuläret
export const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    postcode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Inferera typen från vårt schema
export type RegisterFormData = z.infer<typeof registerSchema>; 