import React from "react";
import TutorEnrollmentTabs from "../../component/TutorsEnrollmentTabs";
import TutorCourseEnrollmentList from "../../component/TutorCurseEnrollmentList";
import { PageTypeProps } from "@/config";

const EnrollmentPage = async ({ params }: PageTypeProps) => {
	const { id } = await params;
	return (
		<div className="py-10 space-y-7 ">
			<TutorCourseEnrollmentList tutorId={id} />
			<TutorEnrollmentTabs userId={id} />
		</div>
	);
};

export default EnrollmentPage;
