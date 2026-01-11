import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { adminCreateNewStudent } from "@/app/actions/admin";
import {
	getDefaultFormValues,
	StudentFormData,
	studentFormSchema,
} from "@/app/(dashboard)/dashboard/admin/users/create/new/student.validation";

export const useStudentForm = () => {
	const router = useRouter();
	const { access_token } = useAuth();

	const form = useForm<StudentFormData>({
		resolver: zodResolver(studentFormSchema),
		defaultValues: getDefaultFormValues(),
		shouldUnregister: false,
	});

	const mutation = useMutation({
		mutationFn: (formData: StudentFormData) =>
			adminCreateNewStudent(formData, access_token ?? ""),
		onSuccess: (data) => {
			toast.success("Success", {
				description: data.message,
				duration: 5000,
				position: "top-right",
			});
		},
		onError: () => {
			toast.error("Error", {
				description: "Failed to add student. Please try again.",
				duration: 5000,
				position: "top-right",
			});
		},
	});

	const handleSubmit = (data: StudentFormData) => {
		mutation.mutate(data);
	};

	const handleCancel = () => {
		router.push("/admin/students");
	};

	const showTuitionAmount = form.watch("tuition_payment_status") !== "UNPAID";

	return {
		form,
		handleSubmit,
		handleCancel,
		isLoading: mutation.isPending,
		showTuitionAmount,
	};
};
