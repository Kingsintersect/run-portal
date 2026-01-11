"use client";
import { UpdateSingleCourse } from '@/app/actions/server.admin';
import { baseUrl } from '@/config';
import { notify } from '@/contexts/ToastProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { InputFormField, TextareaFormField } from '@/components/ui/inputs/FormFields';
import { Button } from '@/components/ui/button';
import { extractErrorMessages } from '@/lib/errorsHandler';
import { Course } from '@/config/Types';

const UpdateCourse = ({ access_token, course }: { access_token: string, course: Course }) => {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<CourseFormData>({ resolver: zodResolver(UpdateCourseSchema), });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const router = useRouter();

   useEffect(() => {
      if (course) {
         reset({
            ...course,
            description: course.description ?? undefined, // Ensure description is string or undefined
         });
      }
   }, [course, reset]);

   const onSubmit = async (data: CourseFormData) => {
      setIsLoading(true);
      try {
         const { error, success }: { error?: unknown; success?: unknown } = await UpdateSingleCourse(course.id, access_token, data);
         if (error) {
            const errorMessages = extractErrorMessages(error);
            errorMessages.forEach((msg) => {
               notify({ message: msg, variant: "error", timeout: 10000 });
            });
            return;
         }
         if (success) {
            notify({ message: 'Course created Successful.', variant: "success", timeout: 5000 })
            router.push(`${baseUrl}/dashboard/admin/course-management/courses`)
            router.refresh();
         }
      } catch (error) {
         console.error("An unexpected error occurred:", error);
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid col-auto text-gray-700 space-y-10 mx-auto p-10 md:p-16 bg-gray-200 w-full sm:w-3/4 md:w-3/4 lg:w-2/3">
            <h1 className="text-3xl font-bold mb-4">
               Update <span className="text-orange-700 font-extralight inline-block ml-10">{course.course_title}</span>
            </h1>
            <InputFormField<CourseFormData>
               type="text"
               id={'course_title'}
               label="Course Title"
               name="course_title"
               register={register}
               error={errors.course_title}
            />
            <InputFormField<CourseFormData>
               type="text"
               id={'course_code'}
               label="Course Code"
               name="course_code"
               register={register}
               error={errors.course_code}
            />
            <TextareaFormField<CourseFormData>
               id="description"
               rows={3}
               placeholder="Short note about the new Department"
               name="description"
               register={register}
               error={errors.description}
            />
            <div className="flex justify-center w-full">
               <Button type='submit'>
                  Save New Department
                  {
                     (isLoading)
                        ? (<Loader2 className="animate-spin" />)
                        : (<ArrowRightIcon className="ml-2 h-5 w-5" />)
                  }
               </Button>
            </div>
         </div>
      </form>
   )
}

export default UpdateCourse

export const UpdateCourseSchema = z
   .object({
      course_title: z
         .string({ message: "Course Title is required" })
         .min(3, "Course Title should be at least 3 characters"),
      course_code: z
         .string({ message: "Course Title is required" })
         .min(3, "Course Title should be at least 3 characters"),
      description: z.string().optional(),
   })

type CourseFormData = z.infer<typeof UpdateCourseSchema>;