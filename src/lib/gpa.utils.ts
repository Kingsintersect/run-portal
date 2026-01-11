// Types
export interface GPAActivity {
	activity_name: string;
	type: string;
	grade: string | number;
}
export interface GPACourse {
	course_id: string;
	course_code: string;
	course_name: string;
	credit_load: number;
	finalgrade?: number | string;
	grade: string;
	activities: GPAActivity[];
}

export interface GPAGradeReport {
	courses: GPACourse[];
	semester: string;
	academicYear: string;
}

export interface SemesterResult {
	gpa: number;
	totalCredits: number;
	totalGradePoints: number;
	courses: GPACourse[];
}

export interface AcademicStanding {
	text: string;
	color: string;
	bgColor: string;
}

export interface GPAStudent {
	reg_number: string;
	name: string;
	email: string;
	program: string;
	enrollmentYear: number;
	profileImage?: string;
}

// Grade Points mapping for 5.00 system
const GRADE_POINTS: Record<string, number> = {
	A: 5.0,
	B: 4.0,
	C: 3.0,
	D: 2.0,
	E: 1.0,
	F: 0.0,
} as const;

// Score to Grade mapping
const SCORE_RANGES = [
	{ min: 70, max: 100, grade: "A" },
	{ min: 60, max: 69, grade: "B" },
	{ min: 50, max: 59, grade: "C" },
	{ min: 45, max: 49, grade: "D" },
	{ min: 40, max: 44, grade: "E" },
	{ min: 0, max: 39, grade: "F" },
] as const;

// Class of Degree boundaries
const DEGREE_CLASSES = [
	{ min: 4.5, max: 5.0, class: "First Class" },
	{ min: 3.5, max: 4.49, class: "Second Class Upper" },
	{ min: 2.4, max: 3.49, class: "Second Class Lower" },
	{ min: 1.5, max: 2.39, class: "Third Class" },
	{ min: 1.0, max: 1.49, class: "Pass" },
] as const;

/**
 * Calculate GPA for a single semester
 * @param courses Array of courses with grades and credit loads
 * @returns GPA rounded to 2 decimal places
 */
export const calculateGPA = (courses: GPACourse[]): number => {
	if (!courses || courses.length === 0) return 0;

	const totalCredits = courses.reduce(
		(sum, course) => sum + (course.credit_load || 0),
		0
	);

	if (totalCredits === 0) return 0;

	const totalGradePoints = courses.reduce((sum, course) => {
		const gradePoint = GRADE_POINTS[course.grade?.toUpperCase()] || 0;
		const creditLoad = course.credit_load || 0;
		return sum + gradePoint * creditLoad;
	}, 0);

	return Number((totalGradePoints / totalCredits).toFixed(2));
};

/**
 * Calculate CGPA from multiple semesters
 * @param semesterResults Array of semester results
 * @returns CGPA rounded to 2 decimal places
 */
export const calculateCGPA = (semesterResults: SemesterResult[]): number => {
	if (!semesterResults || semesterResults.length === 0) return 0;

	const totalCredits = semesterResults.reduce(
		(sum, semester) => sum + semester.totalCredits,
		0
	);

	if (totalCredits === 0) return 0;

	const totalGradePoints = semesterResults.reduce(
		(sum, semester) => sum + semester.totalGradePoints,
		0
	);

	return Number((totalGradePoints / totalCredits).toFixed(2));
};

/**
 * Calculate semester totals for CGPA computation
 * @param courses Array of courses for the semester
 * @returns Semester result with GPA and totals
 */
export const calculateSemesterTotals = (
	courses: GPACourse[]
): SemesterResult => {
	const totalCredits = courses.reduce(
		(sum, course) => sum + (course.credit_load || 0),
		0
	);

	const totalGradePoints = courses.reduce((sum, course) => {
		const gradePoint = GRADE_POINTS[course.grade?.toUpperCase()] || 0;
		const creditLoad = course.credit_load || 0;
		return sum + gradePoint * creditLoad;
	}, 0);

	const gpa =
		totalCredits === 0
			? 0
			: Number((totalGradePoints / totalCredits).toFixed(2));

	return {
		gpa,
		totalCredits,
		totalGradePoints,
		courses,
	};
};

/**
 * Get academic standing based on GPA/CGPA (Nigerian system)
 * @param gpa The GPA or CGPA value
 * @returns Academic standing object with text and styling
 */
export const getAcademicStanding = (gpa: number): AcademicStanding => {
	if (gpa >= 4.5) {
		return {
			text: "First Class",
			color: "text-green-600",
			bgColor: "bg-green-600",
		};
	}
	if (gpa >= 3.5) {
		return {
			text: "Second Class Upper",
			color: "text-blue-600",
			bgColor: "bg-blue-600",
		};
	}
	if (gpa >= 2.4) {
		return {
			text: "Second Class Lower",
			color: "text-yellow-600",
			bgColor: "bg-yellow-600",
		};
	}
	if (gpa >= 1.5) {
		return {
			text: "Third Class",
			color: "text-orange-600",
			bgColor: "bg-orange-600",
		};
	}
	if (gpa >= 1.0) {
		return {
			text: "Pass",
			color: "text-gray-600",
			bgColor: "bg-gray-600",
		};
	}
	return {
		text: "Fail",
		color: "text-red-600",
		bgColor: "bg-red-600",
	};
};

/**
 * Get color styling for individual grades
 * @param grade The letter grade (A, B, C, D, E, F)
 * @returns Tailwind CSS classes for styling
 */
export const getGradeColor = (grade: string): string => {
	const upperGrade = grade?.toUpperCase();

	switch (upperGrade) {
		case "A":
			return "bg-green-100 text-green-800 border-green-200";
		case "B":
			return "bg-blue-100 text-blue-800 border-blue-200";
		case "C":
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
		case "D":
			return "bg-orange-100 text-orange-800 border-orange-200";
		case "E":
			return "bg-gray-100 text-gray-800 border-gray-200";
		case "F":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200";
	}
};

/**
 * Convert numerical score to letter grade
 * @param score Numerical score (0-100)
 * @returns Letter grade (A, B, C, D, E, F)
 */
export const calculateGrade = (score: number): string => {
	if (typeof score !== "number" || score < 0) return "F";

	const range = SCORE_RANGES.find((r) => score >= r.min && score <= r.max);
	return range?.grade || "F";
};

/**
 * Determine class of degree based on CGPA
 * @param cgpa Cumulative Grade Point Average
 * @returns Class of degree string
 */
export const calculateDegreeClass = (cgpa: number): string => {
	if (typeof cgpa !== "number" || cgpa < 0) return "No Classification";

	const degreeClass = DEGREE_CLASSES.find(
		(dc) => cgpa >= dc.min && cgpa <= dc.max
	);
	return degreeClass?.class || "No Classification";
};

/**
 * Get grade point value for a letter grade
 * @param grade Letter grade
 * @returns Grade point value
 */
export const getGradePoint = (grade: string): number => {
	return GRADE_POINTS[grade?.toUpperCase()] || 0;
};

/**
 * Validate and process grade report data
 * @param report Raw grade report data
 * @returns Processed GPAGradeReport
 */
export function processGradeReport(report: any): GPAGradeReport {
	try {
		const processedReport: GPAGradeReport = {
			courses: [],
			semester: report.semester || "",
			academicYear: report.academicYear || "",
		};

		// Handle different data structures
		const coursesData = report.courses || report.data || [];

		if (Array.isArray(coursesData)) {
			processedReport.courses = coursesData.map((course: any) => {
				const finalGrade = Number(course.finalgrade || course.score || 0);

				return {
					course_id:
						course.id?.toString() ||
						course.course_id?.toString() ||
						Math.random().toString(),
					course_code: course.code || course.course_code || "N/A",
					course_name:
						course.name || course.course_name || "Unknown Course",
					credit_load: Number(
						course.credit_load || course.credits || course.units || 3
					),
					finalgrade: finalGrade,
					grade: calculateGrade(finalGrade) || course.grade,
					activities: course.activities || [],
				};
			});
		}

		return processedReport;
	} catch (error) {
		console.error("Error processing grade report:", error);
		return {
			courses: [],
			semester: "",
			academicYear: "",
		};
	}
}

/**
 * Convert semester number to readable name
 * @param semester Semester number or string
 * @returns Formatted semester name
 */
export function getSemesterName(semester: string | number): string {
	const semesterNum = semester.toString();

	const semesterNames: Record<string, string> = {
		"1": "First Semester",
		"2": "Second Semester",
		"3": "Third Semester",
		rain: "Rain Semester",
		harmattan: "Harmattan Semester",
		alpha: "Alpha Semester",
		omega: "Omega Semester",
	};

	return semesterNames[semesterNum.toLowerCase()] || `${semesterNum} Semester `;
}

/**
 * Calculate quality points for a course
 * @param grade Letter grade
 * @param creditLoad Credit units
 * @returns Quality points earned
 */
export const calculateQualityPoints = (
	grade: string,
	creditLoad: number
): number => {
	const gradePoint = getGradePoint(grade);
	return gradePoint * creditLoad;
};

/**
 * Generate GPA summary statistics
 * @param courses Array of courses
 * @returns Summary object with various statistics
 */
export const generateGPASummary = (courses: GPACourse[]) => {
	const gpa = calculateGPA(courses);
	const totalCredits = courses.reduce(
		(sum, course) => sum + course.credit_load,
		0
	);
	const totalQualityPoints = courses.reduce(
		(sum, course) =>
			sum + calculateQualityPoints(course.grade, course.credit_load),
		0
	);

	const gradeDistribution = courses.reduce((dist, course) => {
		const grade = course.grade.toUpperCase();
		dist[grade] = (dist[grade] || 0) + 1;
		return dist;
	}, {} as Record<string, number>);

	return {
		gpa,
		totalCredits,
		totalQualityPoints,
		totalCourses: courses.length,
		degreeClass: calculateDegreeClass(gpa),
		academicStanding: getAcademicStanding(gpa),
		gradeDistribution,
	};
};

// // Institute of Management and Technology, Enugu, Nigeria
// // Grade	Scale	US Grade
// A	75.00 - 100.00	A
// AB	70.00 - 74.00	AB
// B	65.00 - 69.00	B+
// BC	60.00 - 64.00	B
// C	55.00 - 59.00	B-
// CD	50.00 - 54.00	BC
// D	45.00 - 49.00	C+
// E	40.00 - 44.00	C
// F	0.00 - 40.00	F
