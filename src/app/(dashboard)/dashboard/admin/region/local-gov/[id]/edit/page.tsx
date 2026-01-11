import { GetListOfStates, GetSingleLocalGov } from '@/app/actions/server.admin';
import { verifySession } from '@/lib/server.utils';
import React from 'react'
import UpdateLocalGov from '../../components/UpdateLocalGov';
import { loginSessionKey } from '@/lib/definitions';
import { PagePropsWithId } from '@/types/generic.types';

export const dynamic = "force-dynamic";

const EditLGAPage = async ({
   params,
   searchParams,
}: PagePropsWithId) => {
   const { id } = await params;
   const query = searchParams ? await searchParams : {};
   const session = await verifySession(loginSessionKey);
   const parentId = Array.isArray(query) ? query[0] : query;
   const [state, localGov] = await Promise.all([
      GetListOfStates(session.access_token),
      GetSingleLocalGov(id, String(parentId), session.access_token),
   ]);

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <UpdateLocalGov
               // parentId={parentId}
               states={state.success.data}
               access_token={session.access_token}
               localGov={localGov.success.data}
            />
         </div>
      </main>
   )
}

export default EditLGAPage