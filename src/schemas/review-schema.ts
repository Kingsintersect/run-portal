import { z } from "zod";

export const reviewSchema = z.object({
    status: z.enum(["PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED", "WAITLISTED"], {
        required_error: "Status is required",
    }),
    decisionComments: z.string().optional(),
});