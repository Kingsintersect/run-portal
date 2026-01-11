import { GetCoursesAssignedToACategory, GetListOfCourseCategories, GetListOfCourses } from '@/app/actions/server.admin';
import { baseUrl, PageTypeProps } from '@/config';
import { verifySession } from '@/lib/server.utils';
import React from 'react';
import UpdateCourseAssignment from '../../components/UpdateCourseAssignment';
import { loginSessionKey } from '@/lib/definitions';
import NotFound from '../not-found';

export const dynamic = "force-dynamic";

const EditCourseAssingmentPage = async ({ params }: PageTypeProps) => {
   const { id } = await params;

   const basePath = `${baseUrl}/dashboard/admin/course-management/course-assignment`;
   const session = await verifySession(loginSessionKey);

   const [courses, courseCategory, courseAssingnments] = await Promise.all([
      GetListOfCourses(session.access_token),
      GetListOfCourseCategories(session.access_token),
      GetCoursesAssignedToACategory(id, session.access_token),
   ]);


   if (!courseAssingnments.success) {
      return <NotFound />
   }

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <UpdateCourseAssignment
               basePath={basePath}
               courses={courses.success.data}
               courseCategory={courseCategory.success.data}
               courseAssingnments={courseAssingnments.success.data}
               selectedCategoryId={id}
               access_token={session.access_token}
            />
         </div>
      </main>
   )
}

export default EditCourseAssingmentPage