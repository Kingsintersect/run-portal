import { z } from "zod";



export const PayAcceptanceFeeSchema = z.object({
	amount: z
		.number({ required_error: "Amount is required" })
		.positive({ message: "Amount must be a positive number" }),
});
export type PayAcceptanceFormData = z.infer<typeof PayAcceptanceFeeSchema>;