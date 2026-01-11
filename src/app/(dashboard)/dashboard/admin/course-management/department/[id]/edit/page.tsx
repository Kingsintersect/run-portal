import { GetListOfFaculties, GetSingleDepartment } from '@/app/actions/server.admin';
import { verifySession } from '@/lib/server.utils';
import { notFound } from 'next/navigation';
import React from 'react'
import UpdateDeparment from '../../components/UpdateDeparment';
import { loginSessionKey } from '@/lib/definitions';
import { PageTypeProps } from '@/config';

export const dynamic = "force-dynamic";

const Page = async ({ params }: PageTypeProps) => {
   const { id } = await params;
   const session = await verifySession(loginSessionKey);
   const [faculty, department] = await Promise.all([
      GetListOfFaculties(),
      GetSingleDepartment(id, session.access_token),
   ]);

   if (!department) {
      notFound();
   }

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <UpdateDeparment faculties={faculty.success.data} department={department.success.data} access_token={session.access_token} />
         </div>
      </main>
   )
}

export default Page