import CreateCourse from '@/app/(dashboard)/dashboard/admin/course-management/courses/components/CreateCourse'
import { verifySession } from '@/lib/server.utils';
import React from 'react'
import { loginSessionKey } from '@/lib/definitions';

export const dynamic = "force-dynamic";

const page = async () => {
   const session = await verifySession(loginSessionKey);

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <CreateCourse access_token={session.access_token} />
         </div>
      </main>
   )
}

export default page