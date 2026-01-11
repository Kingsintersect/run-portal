import { z } from "zod";

export const CreateCourseSchema = z.object({
	course_title: z
		.string()
		.min(3, "Course Title should be at least 3 characters"),
	course_code: z
		.string()
		.min(3, "Course Code should be at least 3 characters"),
	description: z.string().optional(),
	photo: z
		.custom<File>(
			(file) => file instanceof File,
			"Photo must be a valid file"
		)
		.refine(
			(file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
			{
				message: "Photo must be a JPEG, PNG, or GIF",
			}
		)
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: "Photo size must be less than 5MB",
		})
		.optional(),
});
