import { GetSingleFaculty } from '@/app/actions/server.admin';
import { verifySession } from '@/lib/server.utils';
import { notFound } from 'next/navigation';
import React from 'react'
import UpdateFaculty from '../../components/UpdateFaculty';
import { loginSessionKey } from '@/lib/definitions';
import { PageTypeProps } from '@/config';

export const dynamic = "force-dynamic";

const Page = async ({ params }: PageTypeProps) => {
   const { id } = await params;
   const session = await verifySession(loginSessionKey);
   const { success } = await GetSingleFaculty(session.access_token, id);

   if (!success.data) {
      notFound();
   }


   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <UpdateFaculty faculty={success.data} access_token={session.access_token} />
         </div>
      </main>
   )
}

export default Page