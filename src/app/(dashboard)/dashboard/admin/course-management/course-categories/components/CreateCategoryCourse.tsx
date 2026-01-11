"use client";
import { CreateNewCourseCategory, GetAllDepartmentInAFaculty } from '@/app/actions/server.admin';
import { baseUrl } from '@/config';
import { notify } from '@/contexts/ToastProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { SelectFormField } from '@/components/ui/inputs/FormFields';
import { extractErrorMessages } from '@/lib/errorsHandler';
import { GenericDataType } from '@/types/generic.types';
import { Faculty, Program, SemestersType } from '@/config/Types';

const CreateCourseCategory = ({ access_token, programs, faculties, studyLevels, semesters }: { access_token: string, programs: Program[], faculties: Faculty[], studyLevels: GenericDataType[], semesters: SemestersType[] }) => {
   const {
      handleSubmit,
      formState: { errors, isSubmitting },
      setValue,
      control,
   } = useForm<CourseCategoryFormData>({ resolver: zodResolver(CreateCourseCategorySchema), });
   const [depatments, setDepatments] = useState<GenericDataType[]>([]);
   const router = useRouter();

   const handleFacultyChange = async (facultyId: string) => {
      if (!facultyId) return;

      try {
         const { error, success } = await GetAllDepartmentInAFaculty(facultyId);
         if (error) {
            console.error("Error fetching courses:", error);
            return;
         }

         if (success.data) {
            setDepatments(success.data);
         }
      } catch (error) {
         console.error("An unexpected error occurred:", error);
      }
   };

   const handleProgrammeChange = (program: string) => {
      const programLevel = studyLevels.find(level => level.program === program);
      setValue("level", programLevel?.value || "");
   }

   const onSubmit: SubmitHandler<CourseCategoryFormData> = async (data) => {
      const { error, success } = await CreateNewCourseCategory(access_token, data);
      if (error) {
         const errorMessages = extractErrorMessages(error);
         errorMessages.forEach((msg) => {
            notify({ message: msg, variant: "error", timeout: 10000 });
         });
         return;
      }
      if (success) {
         notify({ message: 'Course created Successful.', variant: "success", timeout: 5000 })
         router.push(`${baseUrl}/dashboard/admin/course-management/course-categories`)
         router.refresh();
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid col-auto text-gray-700 space-y-2 mx-auto p-10 md:p-16 bg-gray-200 w-full sm:w-3/4 md:w-3/4 lg:w-2/3">
            <h1 className="text-3xl font-bold mb-4">
               Create <span className="text-orange-700 font-extralight inline-block">{"New Course Category"}</span>
            </h1>
            <SelectFormField<CourseCategoryFormData>
               name="program"
               label="Program"
               placeholder={"Select the Program"}
               control={control}
               error={errors.program}
               options={Object.values(programs).map(program => ({
                  value: String(program),
                  label: String(program)
               }))} // because programs is an enum
               onValueSelect={handleProgrammeChange}
            />
            <SelectFormField<CourseCategoryFormData>
               name="faculty_id"
               label="Faculty"
               placeholder={"Select the Faculty"}
               control={control}
               error={errors.faculty_id}
               options={faculties.map(faculty => ({ value: String(faculty.id), label: faculty.faculty_name }))}
               onValueSelect={handleFacultyChange}
            />
            <SelectFormField<CourseCategoryFormData>
               name="department_id"
               label="Department"
               placeholder={"Select the Department"}
               control={control}
               error={errors.department_id}
               options={depatments.map(item => ({ value: String(item.id), label: item.department_name }))}
            />
            {/* <SelectFormField<CourseCategoryFormData>
               name="level"
               label="Level "
               placeholder={"Select level"}
               control={control}
               error={errors.level}
               options={studyLevels.map(item => ({ value: String(item.value), label: item.value }))}
            /> */}
            <SelectFormField<CourseCategoryFormData>
               name="semester"
               label="Semester"
               placeholder={"Select semesters"}
               control={control}
               error={errors.level}
               options={semesters.map(item => ({ value: String(item.value), label: item.value }))}
            />

            <div className="flex justify-center w-full">
               <Button type='submit'>
                  Save New Course
                  {
                     (isSubmitting)
                        ? (<Loader2 className="animate-spin" />)
                        : (<ArrowRightIcon className="ml-2 h-5 w-5" />)
                  }
               </Button>
            </div>
         </div>
      </form>
   )
}

export default CreateCourseCategory

export const CreateCourseCategorySchema = z
   .object({
      program: z.string().min(1, "Program is required"),
      faculty_id: z.string().min(1, "Faculty is required"),
      department_id: z.string().min(1, "Select Department"),
      level: z.string().min(1, "Select Study Level"),
      semester: z
         .string({ message: "Semester is required" })
         .min(3, "Semester should be at least 3 characters"),
   })

type CourseCategoryFormData = z.infer<typeof CreateCourseCategorySchema>;
