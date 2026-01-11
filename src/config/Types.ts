import { Roles } from "./constants";

export type SideNavItem = {
	title: string;
	path: string;
	icon?: string;
	submenu?: boolean;
	submenuItems?: SideNavItem[];
};
export type MenuItemWithSubmenuProps = {
	item: SideNavItem;
	toggleOpen: () => void;
};

export type Program = Array<string>;

export type Subject = {
	id: number;
	label: string;
	value: string;
};

export type Grade = {
	id: number;
	label: string;
	value: string;
};

export type SittingCourse = {
	subject: string;
	Grade: string;
};

export enum AdmissionStatusType {
	ADMITTED = "ADMITTED",
	INPROGRESS = "INPROGRESS",
	PENDING = "PENDING",
	"NOT_ADMITTED" = "NOT_ADMITTED"
}
export enum StatusType {
	FULLY_PAID = "FULLY_PAID",
	PART_PAID = "PART_PAID",
	UNPAID = "UNPAID"
}
export interface UserInterface extends Record<string, unknown> {
	id: number | null;
	pictureRef: string | null;
	last_name: string | null;
	first_name: string | null;
	other_name: string | null;
	username: string | null;
	gender: string;
	faculty_id: string | null;
	department_id: string | null;
	program: string | null;
	program_id: string | null;
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
	admission_status: AdmissionStatusType;
	acceptance_fee_payment_status: StatusType;
	tuition_payment_status: StatusType;
	application_payment_status: StatusType;
	created_at: Date | string | null;
	updated_at: Date | string | null;
	deleted_at: Date | string | null;
	role: Roles;
	level: string | null;
	tuition_amount_paid: number | null;
}
export interface StudentApplicationType extends UserInterface {
	religion: string;
	disability: string;
	dob: string;
	hometown: string;
	lga: string;
	hometown_address: string;
	contact_address: string;
	sponsor_name: string;
	sponsor_relationship: string;
	sponsor_phone_number: string;
	sponsor_email: string;
	sponsor_contact_address: string;
	application: Record<string, unknown>;
}
export interface Profile {
	id: number | null;
	first_name: string | null;
	last_name: string | null;
	login: string | null;
	email: string | null;
	phone: string | null;
	reg_number: string | null;
	is_enroll: number | null;
	email_verified_at: string | null;
	created_at: string | null;
	updated_at: string | null;
	deleted_at: string | null;
	level: string | null;
}

export type Department = {
	id: string;
	department_name: string;
	faculty_id: string;
	status?: number;
	description?: string;
};

export type Faculty = {
	id: string;
	faculty_name: string;
	status?: number;
	description?: string;
};

export type Course = {
	id: string;
	course_title: string;
	course_code: string;
	description?: string | null;
};

export type CourseCategory = {
	id: string;
	faculty_id: string;
	program: string;
	department_id: string;
	level: string;
	semester: string;
	short_code?: string;
};

export type AssignedCourse = {
	course_id: number;
	course_code: string;
	credit_load: number;
};
export type CourseAssignment = {
	course_category_id: string;
	assignedCourses?: AssignedCourse[];
};

export type CreditLoad = {
	id: string;
	score: string;
};
export type LabelValueType = {
	label: string;
	value: string;
};
export type SemestersType = {
	label: string;
	value: string;
};

export type Country = {
	id: string;
	name: string;
};
export type State = {
	id: string;
	name: string;
	// parent: number;
};
export type LocalGov = {
	id: string;
	lga: string;
	name?: string;
	lgas?: Array<string>;
	state_id: string;
};
export type CLassSubject = {
	id: string;
	name: string;
};
export type SubjectGrade = {
	id: string;
	name: string;
};
