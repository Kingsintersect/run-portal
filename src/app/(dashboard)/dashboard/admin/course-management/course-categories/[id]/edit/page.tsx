import { GetListOfDepartments, GetListOfFaculties, GetSingleCourseCategory } from '@/app/actions/server.admin';
import UpdateCourseCategory from '@/app/(dashboard)/dashboard/admin/course-management/course-categories/components/UpdateCategoryCourse';
import { StudyLevels, Semesters, PageTypeProps } from '@/config';
import { verifySession } from '@/lib/server.utils';
import React from 'react'
import { loginSessionKey } from '@/lib/definitions';
import { GetAllProgram } from '@/app/actions/faculty.api';

export const dynamic = "force-dynamic";

const page = async ({ params }: PageTypeProps) => {
   const { id } = await params;
   const session = await verifySession(loginSessionKey);

   const [courseCategory, program, faculty, departments] = await Promise.all([
      GetSingleCourseCategory(id, session.access_token),
      GetAllProgram(),
      GetListOfFaculties(),
      GetListOfDepartments(),
   ]);
   const facultyId = courseCategory.success.data.faculty_id;
   const filteredDepartments = departments.success.data.filter((dept) => dept.faculty_id === facultyId);

   const studyLevels = StudyLevels;
   const semesters = Semesters;

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <UpdateCourseCategory
               courseCategory={courseCategory.success.data}
               faculties={faculty.success.data}
               departments={filteredDepartments}
               // departments={department.success.data}
               studyLevels={studyLevels}
               semesters={semesters}
               access_token={session.access_token}
               programs={program.success.data ?? []}
            />
         </div>
      </main>
   )
}

export default page