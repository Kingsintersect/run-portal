import { GetAmissionApprovedStudentList, GetAmissionRejectedStudentList, GetAppliedStudentList, GetUnappliedStudentList } from '@/app/actions/admin';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Roles } from '@/config';
import { loginSessionKey } from '@/lib/definitions';
import { verifySession } from '@/lib/server.utils';
import { SectionCards } from '@/components/section-cards';
import { BarChartMultitple } from '@/components/ui/bar-chart-multiple';
import { ChartAreaInteractive } from '@/components/ui/chart-area-interactive';

const AdminDashboard = async () => {
   const session = await verifySession(loginSessionKey);
   const [approvedAdmission, rejectedAdmission, appliedStudents, unappliedStudents] = await Promise.all([
      GetAmissionApprovedStudentList(session.access_token),
      GetAmissionRejectedStudentList(session.access_token),
      GetAppliedStudentList(session.access_token),
      GetUnappliedStudentList(session.access_token),
   ]);
   const totalAdmitted = approvedAdmission?.success?.data?.length ?? 0;
   const totalRejected = rejectedAdmission?.success?.data?.length ?? 0;
   const totalApplied = appliedStudents?.success?.data?.length ?? 0;
   const totalUnapplied = unappliedStudents?.success?.data?.length ?? 0;
   const totalStudents = totalAdmitted + totalRejected + totalApplied + totalUnapplied

   return (
      <ProtectedRoute allowedRoles={[Roles.ADMIN, Roles.MANAGER]}>
         <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
               <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <SectionCards
                     studentStat={{
                        totalStudents: totalStudents,
                        totalAdmitted: totalAdmitted,
                        totalRejected: totalRejected,
                        totalUnapplied: totalUnapplied
                     }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="col-span-1">
                        <BarChartMultitple />
                     </div>
                     <div className="col-span-2">
                        <ChartAreaInteractive />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </ProtectedRoute>
   )
}

export default AdminDashboard