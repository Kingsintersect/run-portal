import useSignInMultiStepViewModel from "@/hooks/use-signUp-multistep-view-model";

export const usePrograms = () => {
	const {
		parentPrograms,
		childPrograms,
		isProgramsLoading,
		handleProgramChange,
	} = useSignInMultiStepViewModel();

	const handleChildProgramChange = (setValue) => {
		setValue("amount", "10000");
	};

	return {
		parentPrograms,
		childPrograms,
		isProgramsLoading,
		handleProgramChange,
		handleChildProgramChange,
	};
};
