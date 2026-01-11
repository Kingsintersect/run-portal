"use client";

import { useAuth } from '@/contexts/AuthContext';
import EnrolledCourseList from '../componenets/EnrolledCourseList';
import AdmissionDeniedBanner from '../componenets/AdmissionDeniedBanner';
import PageHeader from './components/PageHeader';
import ContentLoader from '@/components/ui/content-loader';

const EnrolledCoursesPage = () => {
   const { user, loading } = useAuth();
   // const isClient = typeof window !== "undefined";
   // const isMobile = isClient && window.innerWidth < 768;

   if (loading || !user) {
      return (
         <ContentLoader />
      );
   }

   if (user?.admission_status === "NOT_ADMITTED") {
      return (
         <AdmissionDeniedBanner statement={user.reason_for_denial as string} />
      )
   }

   const lmsLink = user.reg_number
      ? `https://moodletest.qverselearning.org/ssotester/index.php?sso_loggers=1&u=${user.reg_number}&password=1`
      : "#";

   return (
      <div className="text-gray-600">
         <PageHeader student={user} />
         <EnrolledCourseList
            url={lmsLink}
            student={user}
         />
      </div>
   );
};

export default EnrolledCoursesPage;
