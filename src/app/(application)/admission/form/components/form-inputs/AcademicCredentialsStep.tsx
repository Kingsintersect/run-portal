import { FileUploader } from '@/components/forms/FileUploader';
// import { FileUploadFormField } from '@/components/forms/FormField';
import { ApplicationFormData } from '@/schemas/admission-schema';
import React from 'react'
import { UseFormReturn, } from 'react-hook-form';


interface AcademicCredentialsStepProps {
	form: UseFormReturn<ApplicationFormData>;
}

export const AcademicCredentialsStep: React.FC<AcademicCredentialsStepProps> = ({ form }) => {
	const { control } = form;
	return (
		<div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 gap-5 space-y-5">
			<div className="sm:col-span-2 md:col-span-2">
				<FileUploader
					name="first_school_leaving"
					label="Primary School Leaving Certificate"
					control={control}
					// errors={errors}
					accept=".pdf,.doc,.docx,image/*"
					maxSize={10}
					multiple={false}
				// showPreview={true}
				// className=''
				/>
			</div>
			<div className="sm:col-span-2 md:col-span-2">
				<FileUploader
					name="o_level"
					label="Ordinary Level (O'Level) Certificate"
					control={control}
					// errors={errors}
					accept=".pdf,.doc,.docx,image/*"
					multiple={false}
					maxSize={10}
				// showPreview={true}
				/>
			</div>
			<div className="sm:col-span-2 md:col-span-2">
				<FileUploader
					name="hnd"
					label="Higher National Diploma (HND) certificate"
					control={control}
					// // errors={errors}
					accept=".pdf,.doc,.docx,image/*"
					multiple={false}
					maxSize={10}
				// // showPreview={true}
				/>
			</div>

			<div className="sm:col-span-2 md:col-start-2">
				<FileUploader
					name="degree"
					label="Degree Certificate"
					control={control}
					// // errors={errors}
					accept=".pdf,.doc,.docx,image/*"
					multiple={false}
					maxSize={10}
				// // showPreview={true}
				/>
			</div>
			<div className="sm:col-span-2 md:col-start-4">
				<FileUploader
					name="degree_transcript"
					label="Degree Transcript (You can upload later if not available)"
					control={control}
					// // errors={errors}
					accept=".pdf,.doc,.docx,image/*"
					multiple={false}
					maxSize={10}
				// // showPreview={true}
				/>
			</div>
			<div className="sm:col-span-full md:col-span-4 md:col-start-2">
				<FileUploader
					name="other_documents"
					label="Other Accademic Qualification Documents (Upload multiple files/images clear image of the document)"
					control={control}
					// // errors={errors}
					accept=".pdf,.doc,.docx"
					multiple={true}
					maxSize={10}
					maxFiles={5}
				// // showPreview={true}
				/>
			</div>
		</div>
	);
};
