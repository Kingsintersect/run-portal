import { GetSingleCountry } from '@/app/actions/server.admin';
import { verifySession } from '@/lib/server.utils';
import React from 'react'
import UpdateCountry from '../../components/UpdateCountry';
import { loginSessionKey } from '@/lib/definitions';
import { PageTypeProps } from '@/config';

const page = async ({ params }: PageTypeProps) => {
   const { id } = await params;
   const session = await verifySession(loginSessionKey);
   const { success } = await GetSingleCountry(id);

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <UpdateCountry country={success.country} access_token={session.access_token} />
         </div>
      </main>
   )
}

export default page