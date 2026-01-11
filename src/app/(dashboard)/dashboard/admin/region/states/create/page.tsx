import { GetListOfCountries } from '@/app/actions/server.admin';
import CreateState from '@/app/(dashboard)/dashboard/admin/region/states/components/CreateState';
import { verifySession } from '@/lib/server.utils';
import { notFound } from 'next/navigation';
import React from 'react'
import { loginSessionKey } from '@/lib/definitions';

export const dynamic = "force-dynamic";

const page = async () => {
   const session = await verifySession(loginSessionKey);
   const { success }: any = await new Promise((resolve) => resolve(GetListOfCountries()));

   if (!success) {
      notFound();
   }

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <CreateState country={success} access_token={session.access_token} />
         </div>
      </main>
   )
}

export default page