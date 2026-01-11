"use client";
import { GetAllDepartmentInAFaculty, UpdateSingleCourseCategory } from '@/app/actions/server.admin';
import { baseUrl } from '@/config';
import { notify } from '@/contexts/ToastProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { SelectFormField } from '@/components/ui/inputs/FormFields';
import { Button } from '@/components/ui/button';
import { GenericDataType } from '@/types/generic.types';
import { CourseCategory, Department, Faculty, LabelValueType, Program, SemestersType } from '@/config/Types';

const UpdateCourseCategory = ({ access_token, courseCategory, programs, faculties, departments, studyLevels, semesters }: { access_token: string, courseCategory: CourseCategory, programs: Program[], faculties: Faculty[], departments: Department[], studyLevels: LabelValueType[], semesters: SemestersType[] }) => {
   const {
      handleSubmit,
      reset,
      formState: { errors },
      control,
   } = useForm<CourseCategoryFormData>({
      resolver: zodResolver(UpdateCourseCategorySchema),
      defaultValues: {
         program: String(courseCategory?.program ?? ""),
         faculty_id: String(courseCategory?.faculty_id ?? ""),
         department_id: String(courseCategory?.department_id ?? ""),
         level: String(courseCategory?.level ?? ""),
         semester: String(courseCategory?.semester ?? ""),
      }
   });
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [selectedDepartments, setSelectedDepartments] = useState<GenericDataType[]>([]);
   const router = useRouter();

   useEffect(() => {
      if (courseCategory) {
         reset({
            program: String(courseCategory?.program ?? ""),
            faculty_id: String(courseCategory?.faculty_id ?? ""),
            department_id: String(courseCategory?.department_id ?? ""),
            level: String(courseCategory?.level ?? ""),
            semester: String(courseCategory?.semester ?? ""),
         });
      }
      if (departments) {
         setSelectedDepartments(departments);
      }
   }, [courseCategory, departments, reset]);

   const handleFacultyChange = async (facultyId: string) => {
      if (!facultyId) return;
      try {
         const { error, success } = await GetAllDepartmentInAFaculty(facultyId);
         if (error) {
            console.error("Error fetching courses:", error);
            return;
         }

         if (success.data) {
            setSelectedDepartments(success.data.map((dept: GenericDataType) => ({
               ...dept,
               id: String(dept.id)
            })));
         }
      } catch (error) {
         console.error("An unexpected error occurred:", error);
      }
   };

   const onSubmit = async (data: CourseCategoryFormData) => {
      setIsLoading(true);
      const { error, success } = await UpdateSingleCourseCategory(courseCategory.id, access_token, data);
      if (error) {
         console.log('error', error)
         setIsLoading(false);
         notify({ message: 'Failed to create course! Try again.', variant: "error", timeout: 5000 });
         return;
      }
      if (success) {
         setIsLoading(false);
         notify({ message: 'Course created Successful.', variant: "success", timeout: 5000 })
         router.push(`${baseUrl}/dashboard/admin/course-management/course-categories`)
         router.refresh();
      }
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="grid col-auto text-gray-700 space-y-2 mx-auto p-10 md:p-16 bg-gray-200 w-full sm:w-3/4 md:w-3/4 lg:w-2/3">
            <h1 className="text-3xl font-bold mb-4">
               <span className="text-orange-700 font-extralight inline-block">{courseCategory.short_code}</span>
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
               options={selectedDepartments.map(item => ({ value: String(item.id), label: item.department_name }))}
            />
            <SelectFormField<CourseCategoryFormData>
               name="level"
               label="Level "
               placeholder={"Select level"}
               control={control}
               error={errors.level}
               options={studyLevels.map(item => ({ value: String(item.value), label: item.value }))}
            />
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

export default UpdateCourseCategory

export const UpdateCourseCategorySchema = z
   .object({
      program: z.string().min(1, "Program is required"),
      faculty_id: z.string().min(1, "Faculty is required"),
      department_id: z.string().min(1, "Select Department"),
      level: z.string().min(1, "Select Study Level"),
      semester: z
         .string({ message: "Semester is required" })
         .min(3, "Semester should be at least 3 characters"),
   })

type CourseCategoryFormData = z.infer<typeof UpdateCourseCategorySchema>;