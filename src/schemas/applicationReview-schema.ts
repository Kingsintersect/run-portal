import z from "zod";

export const applicationReview = z.object({
    application_id: z.string(),
    reason: z.string().min(1, "Reason for rejection is required"),
});

export type ApplicationRejectValues = z.infer<typeof applicationReview>;
export type ApplicationApproveValues = {
    application_id: string;
    program: string;
    program_id: string;
    study_mode: string;
    academic_session: string;
    semester: string;
}
export type admissionDecitionActionData =
    | ApplicationRejectValues
    | ApplicationApproveValues