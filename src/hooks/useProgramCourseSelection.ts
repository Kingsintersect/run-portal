import { useState, useEffect } from "react";
import useSignInMultiStepViewModel from "@/hooks/use-signUp-multistep-view-model";

export const useProgramCourseSelection = () => {
	const {
		parentPrograms,
		childPrograms,
		selectedProgramId,
		handleProgramChange,
	} = useSignInMultiStepViewModel();

	const [selectedCourseId, setSelectedCourseId] = useState<string>("");
	const [selectedProgramName, setSelectedProgramName] = useState<string>("");
	const [selectedCourseName, setSelectedCourseName] = useState<string>("");

	const handleCourseChange = (value: string) => {
		setSelectedCourseId(value);
		const selectedCourse = childPrograms?.find(
			(course) => course.value === value
		);
		if (selectedCourse) {
			setSelectedCourseName(selectedCourse.label);
		}
	};

	useEffect(() => {
		if (selectedProgramId && parentPrograms) {
			const program = parentPrograms.find(
				(prog) => Number(prog.value) === Number(selectedProgramId)
			);
			if (program) {
				setSelectedProgramName(program.label);
			}
		}
	}, [selectedProgramId, parentPrograms]);

	return {
		parentPrograms,
		childPrograms,
		selectedProgramId,
		selectedCourseId,
		selectedProgramName,
		selectedCourseName,
		handleProgramChange,
		handleCourseChange,
	};
};
