import { z } from "zod";

export const studentFormSchema = z
	.object({
		first_name: z
			.string()
			.min(2, { message: "First name must be at least 2 characters" }),
		last_name: z
			.string()
			.min(2, { message: "Last name must be at least 2 characters" }),
		other_name: z.string(),
		email: z
			.string()
			.email({ message: "Please enter a valid email address" }),
		username: z
			.string()
			.min(2, { message: "Username must be at least 2 characters" }),
		password: z
			.string()
			.min(6, "Password must be at least 8 characters long")
			.max(32, "Password must not exceed 32 characters"),
		password_confirmation: z.string(),
		dob: z.date({
			required_error: "Date of birth is required",
		}),
		gender: z.enum(["male", "female"], {
			required_error: "Please select a gender",
		}),
		nationality: z.string({
			required_error: "Please select your nationality",
		}),
		state: z.string({ required_error: "Please select your state" }),
		address: z
			.string()
			.min(10, { message: "Address must be at least 10 characters" }),
		phone_number: z
			.string()
			.min(10, { message: "Contact number must be at least 10 characters" }),
		faculty_id: z.string({ required_error: "Please select a program" }),
		department_id: z.string({ required_error: "Please select a course" }),
		application_payment_status: z.enum(["FULLY_PAID", "PART_PAID", "UNPAID"], {
			required_error: "Please set the application payment status",
		}),
		amount: z.string().optional(),
		acceptance_fee_payment_status: z.enum(["FULLY_PAID", "PART_PAID", "UNPAID"], {
			required_error: "Please set the acceptance payment status",
		}),
		tuition_payment_status: z.enum(["FULLY_PAID", "PART_PAID", "UNPAID"]),
		tuition_amount_paid: z.string(),
	})
	.refine(
		(data) => {
			if (data.tuition_payment_status !== "UNPAID") {
				return !!data.tuition_amount_paid?.trim();
			}
			return true;
		},
		{
			message: "Tuition amount is required when payment is marked as paid",
			path: ["tuition_amount_paid"],
		}
	)
	.refine((data) => data.password === data.password_confirmation, {
		message: "Passwords do not match",
		path: ["password_confirmation"],
	});
export type StudentFormData = z.infer<typeof studentFormSchema>;
export const getDefaultFormValues = (): Partial<StudentFormData> => ({
	first_name: "",
	last_name: "",
	other_name: "",
	email: "",
	address: "",
	phone_number: "",
	nationality: "",
	state: "",
	faculty_id: "",
	department_id: "",
	dob: undefined,
	gender: undefined,
	application_payment_status: undefined,
	acceptance_fee_payment_status: undefined,
	tuition_payment_status: undefined,
	tuition_amount_paid: "",
	username: "",
	password: "",
	password_confirmation: "",
});
export interface Program {
	value: string;
	label: string;
}