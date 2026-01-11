import { Roles } from "@/config";

export interface Student {
    id: number | null;
    pictureRef: string | null;
    last_name: string | null;
    first_name: string | null;
    other_name: string | null;
    username: string | null;
    faculty_id: string | null;
    department_id: string | null;
    nationality: string | null;
    state: string | null;
    phone_number: string | null;
    email: string | null;
    password: string | null;
    reference: string | null;
    amount: number | null;
    reg_number: string | null;
    is_applied: number | null;
    reason_for_denial: string | null;
    admission_status: "ADMITTED" | "PENDING" | "NOT_ADMITTED";
    acceptance_fee_payment_status: number;
    tuition_payment_status: number;
    application_payment_status: number;
    created_at: Date | string | null;
    updated_at: Date | string | null;
    deleted_at: Date | string | null;
    role: Roles;
    level: string | null;
    tuition_amount_paid: number | null;
}