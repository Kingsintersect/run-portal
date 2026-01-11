import { z } from 'zod';

export const paymentVerificationSchema = z.object({
    transRef: z.string().min(1, 'Payment reference is required'),
});

export const signInSchema = z.object({
    referenceNumber: z.string().min(1, 'Reference number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type PaymentVerificationForm = z.infer<typeof paymentVerificationSchema>;
export type SignInForm = z.infer<typeof signInSchema>;

// TYPE DEFINITIONS
export interface PaymentVerificationRequest {
    transRef: string;
    access_token?: string;
}

export interface PaymentVerificationResponse {
    status: string;
    message: string;
    studentId?: string;
    amount?: number;
    paymentDate?: string;
}
