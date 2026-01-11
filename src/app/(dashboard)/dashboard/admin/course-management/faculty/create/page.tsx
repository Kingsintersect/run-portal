import { verifySession } from '@/lib/server.utils';
import CreateFaculty from '../components/CreateFaculty';
import { loginSessionKey } from '@/lib/definitions';

export const dynamic = "force-dynamic";

const Page = async () => {
   const session = await verifySession(loginSessionKey);

   return (
      <main className='space-y-10'>
         <div className="w-full bg-white shadow-lg rounded-md px-7 py-20">
            <CreateFaculty access_token={session.access_token} />
         </div>
      </main>
   )
}

export default Page