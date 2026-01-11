import { z } from "zod";
import { Student } from "./student-schema";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
});

const phoneRegex = /^(?:\+234|0)[789][01]\d{8}$/;
export const signUpSchema = z
  .object({
    first_name: z
      .string({ required_error: "Your first name is required" })
      .min(1, "Your first name is required"),
    last_name: z
      .string({ required_error: "Your last name is required" })
      .min(1, "Your last name is required"),
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email"),
    phone: z
      .string()
      .regex(phoneRegex, "Invalid Nigerian phone number")
      .transform((val) => (val.startsWith("0") ? "+234" + val.slice(1) : val)),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be at least 6 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type SignInSchemaType = z.infer<typeof signInSchema>;
export type signUpSchemaType = z.infer<typeof signUpSchema>;

export interface RegisterUserSuccess {
  message: string;
  user: Student
};
export interface LoginUserUserSuccess {
  status: number;
  response: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  user: Student;
}