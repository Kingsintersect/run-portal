"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { notify } from '@/contexts/ToastProvider';
import { Loader2 } from "lucide-react";
import { CreateNewCourseAssignment, GetCoursesAssignedToACategory } from '@/app/actions/server.admin';
import { Button } from '@/components/ui/button';
import { SelectFormField } from '@/components/ui/inputs/FormFields';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { extractErrorMessages } from '@/lib/errorsHandler';
import { GenericDataType } from '@/types/generic.types';

interface Row {
   course: string;
   course_id: number;
   credit_load: number;
}

interface Course {
   id: string;
   course_code: string;
   course_title: string;
   credit_load: number;
}

interface CourseCategory {
   id: string;
   shortCode: string;
}

interface CreateCourseAssignmentProps {
   basePath: string;
   access_token: string;
   courses: Course[];
   courseCategory: CourseCategory[];
}

const CreateCourseAssignment = ({
   basePath,
   access_token,
   courses,
   courseCategory,
}: CreateCourseAssignmentProps) => {
   const {
      handleSubmit,
      formState: { errors, isValid, isSubmitting },
      control,
   } = useForm<CourseAssignmentFormData>({ resolver: zodResolver(CreateCourseAssignmentSchema), });
   const router = useRouter();

   const [selectedCourse, setSelectedCourse] = useState('');
   const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
   const [credit_load, setCreditLoad] = useState<string>('');
   const [rows, setRows] = useState<Row[]>([]);
   const [availableCourses, setAvailableCourses] = useState<Course[]>(courses || []);
   const [assignmentErrors, setAssignmentErrors] = useState<{ course: string; credit_load: string }>({ course: '', credit_load: '' });
   const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);


   // COURSE ASSIGNMENT
   const handleCategoryCourseChange = async (courseCategoryId: string) => {
      if (!courseCategoryId) return;

      try {
         const { error, success } = await GetCoursesAssignedToACategory(courseCategoryId, access_token);
         if (error) {
            console.error("Error fetching courses:", error);
            return;
         }

         const fetchedCourses = success.data.map((course: GenericDataType) => ({
            id: course.id,
            course_code: course.course_code,
            course_title: course.course_title,
            credit_load: course.credit_load,
         }));
         resetRowsAndAvailableCourses(fetchedCourses)
      } catch (error) {
         console.error("An unexpected error occurred:", error);
      }
   };

   const resetRowsAndAvailableCourses = (newData: Course[]) => {
      setRows([]);

      setAvailableCourses(newData);
      setRows((prevRows) => [
         ...prevRows,
         ...newData.map((course: GenericDataType) => ({
            course: course.course_code,
            course_id: course.id,
            credit_load: course.credit_load,
         })),
      ]);
      setSelectedCourse("");
      setSelectedCourseId(null);
      setCreditLoad("");
   }

   const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOption = e.target.selectedOptions[0];
      const courseId = selectedOption?.dataset.id;
      setSelectedCourse(e.target.value);
      setSelectedCourseId(Number(courseId));
      setAssignmentErrors((prev) => ({ ...prev, course: '' }));
   };

   const handleCreditLoadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCreditLoad(e.target.value);
      setAssignmentErrors((prev) => ({ ...prev, credit_load: '' }));
   };

   const handleAddRow = () => {
      if (!IsCourseAndCreditLoadValid()) return

      const newRow: Row = { course: selectedCourse, course_id: selectedCourseId!, credit_load: Number(credit_load) };
      const updatedRows = [...rows, newRow];
      setRows(updatedRows);

      const updatedAvailableCourses = availableCourses.filter(course => course.course_code !== selectedCourse);
      setAvailableCourses(updatedAvailableCourses);

      setSelectedCourse('');
      setSelectedCourseId(null);
      setCreditLoad('');
   };

   const handleEditRow = (index: number) => {
      const rowToEdit = rows[index];
      setSelectedCourse(rowToEdit.course);
      setSelectedCourseId(rowToEdit.course_id);
      setCreditLoad(rowToEdit.credit_load.toString());
      setEditingRowIndex(index);

      setAvailableCourses((prevCourses) => [
         ...prevCourses,
         {
            id: `temp-${rowToEdit.course}`,
            course_code: rowToEdit.course,
            course_title: courses.find((course) => course.course_code === rowToEdit.course)?.course_title || "",
            credit_load: rowToEdit.credit_load,
         },
      ]);
   };

   const handleSaveRow = () => {
      if (!IsCourseAndCreditLoadValid()) return
      if (editingRowIndex === null) return;

      const updatedRows = [...rows];
      updatedRows[editingRowIndex] = { course: selectedCourse, course_id: selectedCourseId!, credit_load: Number(credit_load) };
      setRows(updatedRows);

      const updatedAvailableCourses = [
         ...availableCourses.filter(course => course.course_code !== selectedCourse),
      ];
      setAvailableCourses(updatedAvailableCourses);

      setEditingRowIndex(null);
      setSelectedCourse('');
      setSelectedCourseId(null);
      setCreditLoad('');
   };

   const handleDeleteRow = (index: number) => {
      const deletedRow = rows[index];
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);

      const updatedAvailableCourses = [
         ...availableCourses,
         courses.find(course => course.course_code === deletedRow.course)!
      ];
      setAvailableCourses(updatedAvailableCourses);

      if (selectedCourse === deletedRow.course) {
         setSelectedCourse('');
         setSelectedCourseId(null);
         setCreditLoad('');
      }

      setEditingRowIndex(null);
      setSelectedCourse('');
      setSelectedCourseId(null);
      setCreditLoad('');
   };

   const IsCourseAndCreditLoadValid = () => {
      let status = true;
      if (!selectedCourse) {
         setAssignmentErrors((prev) => ({ ...prev, course: 'Please select a course' }));
         status = false;
      }
      if (!credit_load || isNaN(Number(credit_load)) || Number(credit_load) === 0) {
         setAssignmentErrors((prev) => ({ ...prev, credit_load: 'Enter a valid credit load number' }));
         status = false;
      }
      return status
   }

   const filterAvailableCourses = useCallback(() => {
      const availableCourseCodes = rows.map(row => row.course);
      setAvailableCourses(courses.filter(course => !availableCourseCodes.includes(course.course_code)));
   }, [rows, courses]);

   useEffect(() => {
      filterAvailableCourses();
   }, [filterAvailableCourses]);

   const onSubmit: SubmitHandler<CourseAssignmentFormData> = async (data) => {
      if (rows.length === 0) {
         console.error("No rows to submit");
         return;
      }

      const payload = rows.map(row => ({
         course_code: row.course,
         course_id: row.course_id,
         credit_load: row.credit_load,
      }));

      data['assignments'] = payload;
      const { error, success } = await CreateNewCourseAssignment(access_token, data);
      if (error) {
         const errorMessages = extractErrorMessages(error);
         errorMessages.forEach((msg) => {
            notify({ message: msg, variant: "error", timeout: 10000 });
         });
         return;
      }
      if (success) {
         notify({ message: 'Courses has been assigned Successful.', variant: "success", timeout: 5000 })
         router.push(`${basePath}`)
         router.refresh();
      }
   }

   return (
      <div>
         <form onSubmit={handleSubmit(onSubmit)} className='block space-y-10'>
            <SelectFormField<CourseAssignmentFormData>
               name="course_category_id"
               label={"Course category"}
               placeholder={"Select the Course category"}
               control={control}
               options={courseCategory.map((cat: GenericDataType) => ({ value: String(cat.id), label: cat.short_code }))}
               error={errors.course_category_id}
               onValueSelect={handleCategoryCourseChange}
            />

            <div className="w-full overflow-x-auto">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>COURSE CODE</TableHead>
                        <TableHead>CREDIT UNIT</TableHead>
                        <TableHead>ACTIONS</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {Array.isArray(rows) && rows.map((row, index) => (
                        <TableRow key={index + row.course}>
                           <TableCell>{row.course}</TableCell>
                           <TableCell>{row.credit_load}</TableCell>
                           <TableCell className='flex flex-1 gap-5 text-lg'>
                              <Button type="button" onClick={() => handleEditRow(index)} className='font-semibold' variant={'default'}>Edit</Button>
                              <span className="font-bold">|</span>
                              <Button type="button" onClick={() => handleDeleteRow(index)} className='font-semibold ' variant={'destructive'}>Delete</Button>
                           </TableCell>
                        </TableRow>
                     ))}
                     <TableRow>
                        <TableCell>
                           <select
                              className='border-0 px-4 py-2 rounded-sm bg-[#d454000d] font-bold'
                              value={selectedCourse}
                              onChange={handleCourseChange}
                           >
                              <option value="">Select Course</option>
                              {availableCourses && availableCourses.map((course) => (
                                 <option key={course.id + course.course_code} data-id={course.id} value={course.course_code}>{course.course_code}</option>
                              ))}
                           </select>
                           {assignmentErrors.course && <div className="text-red-500">{assignmentErrors.course}</div>}
                        </TableCell>
                        <TableCell>
                           <input
                              type="text"
                              value={credit_load}
                              onChange={handleCreditLoadChange}
                              placeholder="Enter Credit Load"
                              className='border-0 px-4 py-2 rounded-sm'
                           />
                           {assignmentErrors.credit_load && <div className="text-red-500">{assignmentErrors.credit_load}</div>}
                        </TableCell>
                        <TableCell className='flex flex-1 gap-5 text-lg'>
                           {editingRowIndex !== null ? (
                              <button type="button" onClick={handleSaveRow} className='rounded-lg border-2 border-orange-400 px-5 py-1 bg-orange-50 font-semibold'>Save</button>
                           ) : (
                              <button type="button" onClick={handleAddRow} className='rounded-lg border-2 border-green-400 px-5 py-1 bg-green-50 font-semibold'>Add</button>
                           )}
                        </TableCell>
                     </TableRow>
                  </TableBody>
               </Table>
            </div>
            <div className="flex justify-center w-full">
               <Button
                  type='submit'
                  disabled={!isValid || isSubmitting}
               >
                  {isSubmitting
                     ? (
                        <>
                           <span>{"Saving data "}</span>
                           <Loader2 fontSize={20} size={40} className="animate-spin text-lg" />
                        </>
                     )
                     : <span>{"Save New Course Assignment"}</span>
                  }
               </Button>
            </div>
         </form>
      </div>
   );
};

export default CreateCourseAssignment;


export const CreateCourseAssignmentSchema = z.object({
   course_category_id: z.string().min(1, "Faculty is required"),
   assignments: z
      .array(
         z.object({
            course_id: z.number({ required_error: "Credit Load is required" }),
            course_code: z.string({ required_error: "Course is required" }),
            credit_load: z.number({ required_error: "Credit Load is required" }),
         })
      )
      .optional(),
});

type CourseAssignmentFormData = z.infer<typeof CreateCourseAssignmentSchema>