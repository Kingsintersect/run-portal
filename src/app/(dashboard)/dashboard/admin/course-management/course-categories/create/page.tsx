import { GetListOfFaculties } from '@/app/actions/server.admin';
import CreateCourseCategories from '@/app/(dashboard)/dashboard/admin/course-management/course-categories/components/CreateCategoryCourse';
import { Semesters, StudyLevels } from '@/config';
import { verifySession } from '@/lib/server.utils';
import React from 'react';
import { loginSessionKey } from '@/lib/definitions';
import { GetAllProgram } from '@/app/actions/faculty.api';

export const dynamic = "force-dynamic";

const page = async () => {
   const session = await verifySession(loginSessionKey);

   const [program, faculty] = await Promise.all([
      GetAllProgram(),
      GetListOfFaculties(),
   ]);
   const studyLevels = StudyLevels;
   const semesters = Semesters;


   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <CreateCourseCategories
               faculties={faculty.success.data ?? []}
               studyLevels={studyLevels ?? []}
               semesters={semesters ?? []}
               access_token={session.access_token}
               programs={program.success.data ?? []}
            />
         </div>
      </main>
   )
}

export default page