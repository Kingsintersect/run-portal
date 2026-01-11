import { Roles } from "@/config";
import { UserInterface } from "@/config/Types";
import { ObjectType } from "@/types/generic.types";

// export interface UserType {
// 	id: string;
// 	name: string;
// 	email: string;
// 	role: Roles;
// }

export interface Student extends UserInterface {
	role: Roles.STUDENT;
	studentId: string;
	course: string;
	enrollmentDate: string
	passport: string;
}

export interface Admin extends UserInterface {
	role: Roles.ADMIN;
	adminId: string;
	department: string;
	passport: string;
}

export interface Teacher extends UserInterface {
	role: Roles.TEACHER;
	teacherId: string;
	department: string;
	passport: string;
}

export type AuthUser = Student | Admin | Teacher;

export type AuthState = {
	user: AuthUser | null;
	access_token: string | null;
	loading: boolean;
	error: string | null | ObjectType;
};
