import { GetSingleCourse } from '@/app/actions/server.admin';
import { verifySession } from '@/lib/server.utils';
import React from 'react'
import UpdateCourse from '../../components/UpdateCourse';
import { loginSessionKey } from '@/lib/definitions';
import { PageTypeProps } from '@/config';

export const dynamic = "force-dynamic";

const page = async ({ params }: PageTypeProps) => {
   const { id } = await params;
   const session = await verifySession(loginSessionKey);
   const [course] = await Promise.all([
      GetSingleCourse(id, session.access_token),
   ]);

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <UpdateCourse course={course.success.data} access_token={session.access_token} />
         </div>
      </main>
   )
}

export default page