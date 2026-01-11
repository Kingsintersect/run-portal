import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { baseUrl } from "@/config";
import { notify } from "@/contexts/ToastProvider";
import { CreateUsersByCsv } from "@/app/actions/auth-actions";
// Define the user data structure
export interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	phoneNumber?: string;
	address?: string;
	program?: string; // Added program field
	course?: string; // Added course field
	[key: string]: unknown; // Allow for additional fields
}
interface EnrichmentData {
	programName: string;
	courseName: string;
	tuitionPaymentStatus: string;
	tuitionAmount: string;
	applicationPaymentStatus: string;
	acceptancePaymentStatus: string;
}
// Define the upload state
export interface UploadState {
	status: "idle" | "uploading" | "success" | "error";
	progress: number;
	message: string | null;
}

export const useCreateUsers = () => {
	const basePath = `${baseUrl}/dashboard/admin/users`;
	const router = useRouter();
	const { access_token } = useAuth();

	const [fileData, setFileData] = useState<UserData[]>([]);
	const [currentFile, setCurrentFile] = useState<File | null>(null);
	const [uploadState, setUploadState] = useState<UploadState>({
		status: "idle",
		progress: 0,
		message: null,
	});



	const handleFileDataReceived = (
		data: UserData[],
		file: File,
		enrichmentData: EnrichmentData
	) => {
		const enrichedData = data.map((record) => ({
			...record,
			program: enrichmentData.programName,
			course: enrichmentData.courseName,
			tuition_payment_status: enrichmentData.tuitionPaymentStatus,
			tuition_amount_paid:
				enrichmentData.tuitionPaymentStatus === "1"
					? enrichmentData.tuitionAmount
					: "0",
			application_payment_status: enrichmentData.applicationPaymentStatus,
			acceptance_fee_payment_status: enrichmentData.acceptancePaymentStatus,
		}));

		setFileData(enrichedData);
		setCurrentFile(file);
		setUploadState({
			status: "idle",
			progress: 0,
			message: null,
		});
	};

	const handleRemoveFile = () => {
		setCurrentFile(null);
		setFileData([]);
		setUploadState({
			status: "idle",
			progress: 0,
			message: null,
		});
	};

	const handleUpload = async (formData: FormData) => {
		if (!access_token || !currentFile) {
			notify({
				message: "No Access Token or File Found!",
				variant: "error",
				timeout: 5000,
			});
			return;
		}

		try {
			setUploadState({
				status: "uploading",
				progress: 0,
				message: "Uploading users...",
			});

			const progressInterval = setInterval(() => {
				setUploadState((prev) => ({
					...prev,
					progress: Math.min(prev.progress + Math.random() * 15, 90),
				}));
			}, 300);

			const { error, success } = await CreateUsersByCsv(
				access_token,
				formData
			);
			clearInterval(progressInterval);

			if (error) {
				console.error("Upload error:", error);
				setUploadState({
					status: "error",
					progress: 0,
					message:
						typeof error === "string"
							? error
							: "Failed to upload users. Please check your file format.",
				});
				notify({
					message: "Failed to upload user document!",
					variant: "error",
					timeout: 5000,
				});
				return;
			}

			if (success) {
				setUploadState({
					status: "success",
					progress: 100,
					message: "Users uploaded successfully!",
				});
				notify({
					message: "Users uploaded successfully.",
					variant: "success",
					timeout: 5000,
				});

				setTimeout(() => {
					router.push(basePath);
					router.refresh();
				}, 2000);
			}
		} catch {
			setUploadState({
				status: "error",
				progress: 0,
				message: "An unexpected error occurred during upload.",
			});
			notify({
				message: "An unexpected error occurred.",
				variant: "error",
				timeout: 5000,
			});
		}
	};

	return {
		fileData,
		currentFile,
		uploadState,
		basePath,
		handleFileDataReceived,
		handleRemoveFile,
		handleUpload,
	};
};
