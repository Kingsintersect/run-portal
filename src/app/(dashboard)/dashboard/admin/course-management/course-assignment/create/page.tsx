import { GetListOfCourseCategories, GetListOfCourses } from '@/app/actions/server.admin';
import { baseUrl } from '@/config';
import { verifySession } from '@/lib/server.utils';
import React from 'react'
import CreateCourseAssignment from '../components/CreateCourseAssignment';
import { loginSessionKey } from '@/lib/definitions';

export const dynamic = "force-dynamic";

const page = async () => {
   const basePath = `${baseUrl}/dashboard/admin/course-management/course-assignment`;
   const session = await verifySession(loginSessionKey);

   const [courses, courseCategory] = await Promise.all([
      GetListOfCourses(session.access_token),
      GetListOfCourseCategories(session.access_token),
   ]);

   return (
      <main className='space-y-10'>
         <div className="p-6">
         </div>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <CreateCourseAssignment basePath={basePath} courses={courses.success.data ?? []} courseCategory={courseCategory.success.data ?? []} access_token={session.access_token} />
         </div>
      </main>
   )
}

export default page