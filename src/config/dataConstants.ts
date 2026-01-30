import {
	BookOpen,
	DollarSign,
	Flag,
	GraduationCap,
	MapPinHouse,
	PieChart,
	UserRoundPen,
	CalendarCheck,
	School2,
	MessageSquare,
	Settings2,
	LucideIcon
} from "lucide-react";
import { ObjectType } from "@/types/generic.types";
import { CreditLoad, Grade, Subject } from "./Types";

export interface SidebarNavItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: { title: string; url: string }[];
	display: boolean;
}

export interface SidebarNavConfig {
	compound: SidebarNavItem[];
	flat?: {
		title: string;
		url: string;
		icon: LucideIcon;
		display: boolean;
	}[];
}

export const AdminNavMain: SidebarNavConfig = {
	compound: [
		{
			title: "DASHBOARD",
			url: "#",
			icon: PieChart,
			isActive: true,
			items: [
				{
					title: "Statistics",
					url: "/dashboard/admin",
				},
			],
			display: true,
		},
		{
			title: "USERS",
			url: "#",
			icon: GraduationCap,
			items: [
				{
					title: "Manage Admission",
					url: "/dashboard/admin/manage-admissions",
				},
				{
					title: "Manage Students",
					url: "/dashboard/admin/students",
				},
				{
					title: "Add New User",
					url: "/dashboard/admin/users/create",
				},
				{
					title: "Tutors Enrolment",
					url: "/dashboard/admin/users/tutors-enrollment",
				},
				{
					title: "Course Assingment",
					url: "/dashboard/admin/users/course-assignment",
				},
			],
			display: true,
		},
		{
			title: "ACADEMIC SETUP",
			url: "#",
			icon: GraduationCap,
			items: [
				{
					title: "Migrate Students",
					url: "/dashboard/admin/session-migrations",
				},
			],
			display: true,
		},
		{
			title: "COURSE MANAGEMENT",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Faculties",
					url: "/dashboard/admin/course-management/faculty",
				},
				{
					title: "Departments",
					url: "/dashboard/admin/course-management/department",
				},
				{
					title: "Courses",
					url: "/dashboard/admin/course-management/courses",
				},
				{
					title: "Course Categories",
					url: "/dashboard/admin/course-management/course-categories",
				},
				{
					title: "Course Assignments",
					url: "/dashboard/admin/course-management/course-assignment",
				},
			],
			display: true,
		},
		{
			title: "COURSE GRADES",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Veiw Student Report",
					url: "/dashboard/admin/students-grade-report",
				},
			],
			display: true,
		},
		{
			title: "REGION MANAGEMENT",
			url: "#",
			icon: MapPinHouse,
			items: [
				{
					title: "Countries",
					url: "/dashboard/admin/region/countries",
				},
				{
					title: "States",
					url: "/dashboard/admin/region/states",
				},
				{
					title: "Local Government Areas",
					url: "/dashboard/admin/region/local-gov",
				},
			],
			display: false,
		},
	]
}
export const StudentNavMain: SidebarNavConfig = {
	compound: [
		{
			title: "DASHBOARD",
			url: "#",
			icon: PieChart,
			isActive: true,
			items: [
				{
					title: "Statistics",
					url: "/dashboard/student",
				},
			],
			display: true,
		},
		{
			title: "PAYMENTS",
			url: "#",
			icon: DollarSign,
			items: [
				{
					title: "Pay Acceptance Fee",
					url: "/dashboard/student/history/student-payments/acceptance",
				},
				{
					title: "Pay Tuition Fee",
					url: "/dashboard/student/history/student-payments/tuition",
				},
			],
			display: false,
		},
		{
			title: "HISTORY",
			url: "#",
			icon: DollarSign,
			items: [
				{
					title: "Payment History",
					url: "/dashboard/student/history/student-payments",
				},
				{
					title: "Result History",
					url: "/dashboard/student/history/student-results",
				},
			],
			display: true,
		},
		{
			title: "MANAGE ACCOUNT",
			url: "#",
			icon: UserRoundPen,
			items: [
				{
					title: "Enrolled Courses",
					url: "/dashboard/student/enrolled-courses",
				},
				{
					title: "Profile",
					url: "/dashboard/student/profile",
				},
			],
			display: true,
		},
		{
			title: "REPORTS",
			url: "#",
			icon: Flag,
			items: [
				{
					title: "Grade Report",
					url: "/dashboard/student/grade-report",
				},
			],
			display: true,
		},
	]
}
export const TeacherNavMain: SidebarNavConfig = {
	compound: [
		{
			title: "DASHBOARD",
			url: "#",
			icon: PieChart,
			isActive: true,
			items: [
				{
					title: "Overview",
					url: "/dashboard/teacher",
				},
			],
			display: true,
		},
	],
	flat: [
		{
			title: "My COURSES",
			url: "/dashboard/teacher/enrolled-courses",
			icon: GraduationCap,
			display: true,
		},
		{
			title: "ASSIGNMENTS",
			url: "/dashboard/teacher/assignments",
			icon: School2,
			display: true,
		},
		{
			title: "CALENDER",
			url: "/dashboard/teacher/calender",
			icon: CalendarCheck,
			display: true,
		},
		{
			title: "DISCUSSIONS",
			url: "/dashboard/teacher/discussions",
			icon: MessageSquare,
			display: true,
		},
		{
			title: "SETTINGS",
			url: "/dashboard/teacher/settings",
			icon: Settings2,
			display: false,
		},
	],
};

export const CreditLoads: CreditLoad[] = [
	{ id: "1", score: "1" },
	{ id: "2", score: "2" },
	{ id: "3", score: "3" },
	{ id: "4", score: "4" },
	{ id: "5", score: "5" },
];

export const Gender = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
];

export const StudyLevels = [
	{ label: "Level 100", value: "100" },
	{ label: "Level 200", value: "200" },
	{ label: "Level 300", value: "300" },
	{ label: "Level 400", value: "400" },
	{ label: "Level 500", value: "500" },
	{ label: "Level 600", value: "600" },
];

export const Semesters = [
	{ label: "1st Semester", value: "1SM" },
	{ label: "2nd Semester", value: "2SM" },
];

export const certificateType = [
	{ label: "WAEC", value: "WAEC" },
	{ label: "NECO", value: "NECO" },
	{ label: "NABTEB", value: "NABTEB" },
	{ label: "GCE", value: "GCE" },
];

export const educationalLevelList = [
	{ label: "Bachalors Of Science", value: "Bsc" },
	{ label: "Higher National Diploma", value: "HND" },
];

export const LocalGovAreaList = [
	{ label: "Enugu North", value: "Enugu North" },
	{ label: "Enugu South", value: "Enugu South" },
	{ label: "Igboeze North", value: "Igboeze North" },
];

export const Religion = [
	{ label: "Christianity", value: "Christianity" },
	{ label: "Islamic", value: "Islamic" },
];

export const YesOrNo = [
	{ label: "Yes", value: "yes" },
	{ label: "No", value: "no" },
];

export const OLevels = [
	{ label: "NABTEB", value: "NABTEB" },
	{ label: "NECO(JUNE/JULY)", value: "NECO(JUNE/JULY)" },
	{ label: "NECO(NOV/DEC)", value: "NECO(NOV/DEC)" },
	{ label: "WAEC(JUNE/JULY)", value: "WAEC(JUNE/JULY)" },
	{ label: "WAEC(NOV/DEC)", value: "WAEC(NOV/DEC)" },
	{ label: "RSA", value: "RSA" },
	{ label: "TC II", value: "TC II" },
];

export const Years = [
	{ label: "1960", value: "1960" },
	{ label: "1961", value: "1961" },
	{ label: "1962", value: "1962" },
	{ label: "1963", value: "1963" },
	{ label: "1964", value: "1964" },
	{ label: "1965", value: "1965" },
	{ label: "1966", value: "1966" },
	{ label: "1967", value: "1967" },
	{ label: "1968", value: "1968" },
	{ label: "1969", value: "1969" },
	{ label: "1970", value: "1970" },
	{ label: "1971", value: "1971" },
	{ label: "1972", value: "1972" },
	{ label: "1973", value: "1973" },
	{ label: "1974", value: "1974" },
	{ label: "1975", value: "1975" },
	{ label: "1976", value: "1976" },
	{ label: "1977", value: "1977" },
	{ label: "1978", value: "1978" },
	{ label: "1979", value: "1979" },
	{ label: "1980", value: "1980" },
	{ label: "1981", value: "1981" },
	{ label: "1983", value: "1983" },
	{ label: "1984", value: "1984" },
	{ label: "1985", value: "1985" },
	{ label: "1986", value: "1986" },
	{ label: "1987", value: "1987" },
	{ label: "1988", value: "1988" },
	{ label: "1989", value: "1989" },
	{ label: "1990", value: "1990" },
	{ label: "1991", value: "1991" },
	{ label: "1992", value: "1992" },
	{ label: "1993", value: "1993" },
	{ label: "1994", value: "1994" },
	{ label: "1995", value: "1995" },
	{ label: "1996", value: "1996" },
	{ label: "1997", value: "1997" },
	{ label: "1998", value: "1998" },
	{ label: "1999", value: "1999" },
	{ label: "2000", value: "2000" },
	{ label: "2001", value: "2001" },
	{ label: "2002", value: "2002" },
	{ label: "2003", value: "2003" },
	{ label: "2004", value: "2004" },
	{ label: "2005", value: "2005" },
	{ label: "2006", value: "2006" },
	{ label: "2007", value: "2007" },
	{ label: "2008", value: "2008" },
	{ label: "2009", value: "2009" },
	{ label: "2010", value: "2010" },
	{ label: "2011", value: "2011" },
	{ label: "2012", value: "2012" },
	{ label: "2013", value: "2013" },
	{ label: "2014", value: "2014" },
	{ label: "2015", value: "2015" },
	{ label: "2016", value: "2016" },
	{ label: "2017", value: "2017" },
	{ label: "2018", value: "2018" },
	{ label: "2019", value: "2019" },
	{ label: "2020", value: "2020" },
	{ label: "2021", value: "2021" },
	{ label: "2022", value: "2022" },
	{ label: "2023", value: "2023" },
	{ label: "2024", value: "2024" },
];

export const courses: Subject[] = [
	{ id: 1, label: "English", value: "English" },
	{ id: 2, label: "Mathematics", value: "Mathematics" },
	{ id: 3, label: "Chemistry", value: "Chemistry" },
	{ id: 4, label: "Physics", value: "Physics" },
	{ id: 5, label: "Agriculture", value: "Agriculture" },
	{ id: 6, label: "Biology", value: "Biology" },
	{ id: 7, label: "Economics", value: "Economics" },
	{ id: 8, label: "Food and Nutrition", value: "Food and Nutrition" },
	{ id: 9, label: "Further Mathematics", value: "Further Mathematics" },
	{ id: 10, label: "Geography", value: "Geography" },
	{ id: 11, label: "Igbo", value: "Igbo" },
	{ id: 12, label: "Hausa", value: "Hausa" },
	{ id: 13, label: "Yoruba", value: "Yoruba" },
	{ id: 14, label: "Civic Education", value: "Civic Education" },
	{ id: 15, label: "Commerce", value: "Commerce" },
];

export const grades: Grade[] = [
	{ id: 1, label: "A1", value: "A1" },
	{ id: 2, label: "B2", value: "B2" },
	{ id: 3, label: "B3", value: "B3" },
	{ id: 4, label: "C4", value: "C4" },
	{ id: 5, label: "C5", value: "C5" },
	{ id: 6, label: "C6", value: "C6" },
	{ id: 7, label: "D7", value: "D7" },
	{ id: 8, label: "E8", value: "E8" },
	{ id: 9, label: "F9", value: "F9" },
];
export const Programme: ObjectType[] = [
	{ id: 1, label: "Ordinary Level", value: "O'Level" },
	{ id: 2, label: "Advaced Level", value: "A'Level" },
	{ id: 3, label: "Ordiary National Diplomer", value: "OND" },
	{ id: 4, label: "Higher National Diplomer", value: "HND" },
	{ id: 5, label: "Bachalor's of science", value: "Bsc" },
];
export const Department: ObjectType[] = [
	{ id: 1, label: "Computer Sciences", value: "Computer_sciences" },
	{ id: 2, label: "Agric Sciences", value: "Agric_sciences" },
];
export const Nationality: ObjectType[] = [
	{ id: 1, label: "Nigerian", value: "Nigeria" },
	{ id: 2, label: "Other", value: "other" },
];
export const State: ObjectType[] = [
	{ id: 1, label: "Abia", value: "Abia" },
	{ id: 2, label: "Adamawa", value: "Adamawa" },
	{ id: 3, label: "Akwa Ibom", value: "Akwa Ibom" },
	{ id: 4, label: "Anambra", value: "Anambra" },
	{ id: 5, label: "Bauchi", value: "Bauchi" },
	{ id: 6, label: "Bayelsa", value: "Bayelsa" },
	{ id: 7, label: "Benue", value: "Benue" },
	{ id: 8, label: "Borno", value: "Borno" },
	{ id: 9, label: "Cross River", value: "Cross River" },
	{ id: 10, label: "Delta", value: "Delta" },
	{ id: 11, label: "Ebonyi", value: "Ebonyi" },
	{ id: 12, label: "Edo", value: "Edo" },
	{ id: 13, label: "Ekiti", value: "Ekiti" },
	{ id: 14, label: "Enugu", value: "Enugu" },
	{ id: 15, label: "Gombe", value: "Gombe" },
	{ id: 16, label: "Imo", value: "Imo" },
	{ id: 36, label: "Jigawa", value: "Jigawa" },
	{ id: 17, label: "Kaduna", value: "Kaduna" },
	{ id: 18, label: "Kano", value: "Kano" },
	{ id: 19, label: "Katsina", value: "Katsina" },
	{ id: 20, label: "Kebbi", value: "Kebbi" },
	{ id: 21, label: "Kogi", value: "Kogi" },
	{ id: 22, label: "Kwara", value: "Kwara" },
	{ id: 23, label: "Lagos", value: "lagos" },
	{ id: 24, label: "Nasarawa", value: "Nasarawa" },
	{ id: 25, label: "Ogun", value: "Ogun" },
	{ id: 26, label: "Ondo", value: "Ondo" },
	{ id: 27, label: "Osun", value: "Osun" },
	{ id: 28, label: "Oyo", value: "Oyo" },
	{ id: 29, label: "Plateau", value: "Plateau" },
	{ id: 30, label: "Rivers", value: "Rivers" },
	{ id: 31, label: "Sokoto", value: "Sokoto" },
	{ id: 32, label: "Taraba", value: "Taraba" },
	{ id: 33, label: "Yobe", value: "Yobe" },
	{ id: 34, label: "Zamfara", value: "Zamfara" },
	{
		id: 35,
		label: "Federal Capital Territory",
		value: "Federal Capital Territory",
	},
];

export const stateValues = [
	"Abia State",
	"Adamawa",
	"Akwa Ibom",
	"Anambra",
	"Bauchi",
	"Bayelsa",
	"Benue",
	"Borno",
	"Cross River",
	"Delta",
	"Ebonyi",
	"Edo",
	"Ekiti",
	"Enugu",
	"Gombe",
	"Imo",
	"Jigawa",
	"Kaduna",
	"Kano",
	"Katsina",
	"Kebbi",
	"Kogi",
	"Kwara",
	"Lagos",
	"Nasarawa",
	"Ogun",
	"Ondo",
	"Osun",
	"Oyo",
	"Plateau",
	"Rivers",
	"Sokoto",
	"Taraba",
	"Yobe",
	"Zamfara",
	"Federal Capital Territory",
];
