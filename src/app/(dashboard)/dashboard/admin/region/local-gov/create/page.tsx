import { GetListOfStates } from '@/app/actions/server.admin';
import { verifySession } from '@/lib/server.utils';
import { notFound } from 'next/navigation';
import React from 'react'
import CreateLocalGov from '../components/CreateLocalGov';
import { loginSessionKey } from '@/lib/definitions';

export const dynamic = "force-dynamic";

const page = async () => {
   const session = await verifySession(loginSessionKey);
   const { success }: any = await new Promise((resolve) => resolve(GetListOfStates(session.access_token)));

   if (!success) {
      notFound();
   }

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <CreateLocalGov states={success.data} access_token={session.access_token} />
         </div>
      </main>
   )
}

export default page