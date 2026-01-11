import { GetListOfCountries, GetSingleState } from '@/app/actions/server.admin';
import UpdateState from '../../components/UpdateState';
import { verifySession } from '@/lib/server.utils';
import React from 'react'
import { loginSessionKey } from '@/lib/definitions';
import { PageTypeProps } from '@/config';

export const dynamic = "force-dynamic";

const page = async ({ params }: PageTypeProps) => {
   const { id } = await params;
   const session = await verifySession(loginSessionKey);
   const [country, state] = await Promise.all([
      GetListOfCountries(),
      GetSingleState(id, session.access_token),
   ]);

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <UpdateState access_token={session.access_token} state={state.success.data} />
         </div>
      </main>
   )
}

export default page