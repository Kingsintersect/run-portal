import { z } from "zod";

// LOGIN VALIDATION SCHEMA
export const SigninSchema = z.object({
	reference: z
		.string({ required_error: "Email or Reference Number is required" })
		.min(1, "Email or Reference Number is required")
		.refine(
			(val) => {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				const refRegex = /^[A-Za-z0-9_-]+$/; // Customize based on your ref format
				return emailRegex.test(val) || refRegex.test(val);
			},
			{
				message: "Enter a valid email or reference number",
			}
		),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

// FORGOT PASSWORD


export const ForgotPasswordSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email." }),
});
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
// RESET PASSWORD
export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(6, { message: "Password should be at least 6 characters long" }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
// CHANGE PASSWORD
export const ChangePasswordSchema = z.object({
	currentPassword: z.string(),
	newPassword: z.string().min(6, {
		message: "Your new password should be at least 6 characters long",
	}),
});

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;