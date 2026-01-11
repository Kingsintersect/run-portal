import { z } from "zod";


export const UpdateUserRoleSchema = z.object({
	role: z.string().min(3, "Role must not be empty"),
});
export type UpdateUserRoleFormData = z.infer<typeof UpdateUserRoleSchema>;

export const UserRoles = [
	{ label: "ADMIN", value: "ADMIN" },
	{ label: "STUDENT", value: "STUDENT" },
	{ label: "TEACHER", value: "TEACHER" },
	{ label: "MANAGER", value: "MANAGER" },
];
export enum Roles {
	ADMIN = "ADMIN",
	STUDENT = "STUDENT",
	TEACHER = "TEACHER",
	MANAGER = "MANAGER",
}
