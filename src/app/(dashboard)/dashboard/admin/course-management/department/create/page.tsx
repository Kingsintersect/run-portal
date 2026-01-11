import { GetListOfFaculties } from '@/app/actions/server.admin';
import CreateDeparment from '@/app/(dashboard)/dashboard/admin/course-management/department/components/CreateDeparment';
import { verifySession } from '@/lib/server.utils';
import { loginSessionKey } from '@/lib/definitions';

export const dynamic = "force-dynamic";

const Page = async () => {
   const session = await verifySession(loginSessionKey);
   const { success }: any = await new Promise((resolve) => resolve(GetListOfFaculties()));

   return (
      <main className='space-y-10'>
         <div className="p-6">
         </div>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <CreateDeparment faculties={success.data} access_token={session.access_token} />
         </div>
      </main>
   )
}

export default Page