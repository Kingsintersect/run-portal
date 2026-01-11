"use client";

import { fetchSingleStudentApplications } from "@/app/actions/admin";
import { Card } from "@/components/ui/card";
import ContentEmpty from "@/components/ui/content-empty";
import ContentLoader from "@/components/ui/content-loader";
import { useAuth } from "@/contexts/AuthContext";
import { notify } from "@/contexts/ToastProvider";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import InfoItem from "./components/InfoItem";
import SponsorInfo from "./components/SponsorInfo";
import AdmissionStatus from "./components/AdmissionStatus";
import ExamSittingDetails from "./components/ExamSittingDetails";
import AdmissionActionButtons from "./components/AdmissionActionButtons";
import { useParams } from "next/navigation";

const StudentApplicationDetails = () => {
   const params = useParams();
   const id = params?.id as string;
   const { access_token } = useAuth();
   const {
      data,
      isLoading,
      error,
      isError,
   } = useQuery({
      queryKey: ['student-application', id],
      queryFn: async () => {
         if (!access_token) return;
         const response = await fetchSingleStudentApplications(access_token, id);
         if (response.error) {
            return;
            // throw new Error(response.error.message);
         }
         return response.success.data;
      },
      enabled: !!access_token && !!id,
   });

   if (isLoading) {
      return <ContentLoader />;
   }

   if (isError || !data) {
      notify({ message: 'Something went wrong!', variant: "error", timeout: 5000 });
      console.error('Error fetching student application details:', error);
      return <ContentEmpty />;
   }

   const hasApplication = !!data.application;

   if (!hasApplication) {
      return (
         <Card className="p-7">
            <div className="flex items-center justify-center min-h-[400px] text-gray-600 text-5xl">
               Student Has Not Applied Yet
            </div>
         </Card>
      );
   }

   const firstSitting = hasApplication ? JSON.parse(data.application.first_sitting) : null;
   const secondSitting = hasApplication ? JSON.parse(data.application.second_sitting) : null;

   return (
      <div className='space-y-7'>
         {/* Student Basic Info Section */}
         <div className="grid sm:grid-cols-3 gap-7">
            {/* Student Photo */}
            <div className="min-h-[200px] sm:col-span-1">
               <Card className="p-7">
                  <div className="relative w-auto h-72">
                     {data?.application.passport && (
                        <Image
                           src={data?.application.passport}
                           fill
                           style={{ objectFit: "cover" }}
                           alt="Student Passport"
                        />
                     )}
                  </div>
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                     {data?.first_name + " " + data?.last_name}
                  </h5>
               </Card>
            </div>

            {/* Student Details */}
            <div className="min-h-[200px] sm:col-span-2">
               <Card className="h-full p-7">
                  <div className="flow-root">
                     <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-600">
                        <InfoItem label="Gender" value={data?.application.gender} />
                        <InfoItem label="Date Of Birth" value={data?.application.dob} />
                        <InfoItem label="Home Town" value={data?.application.hometown} />
                        <InfoItem label="Local Gov. Area" value={data?.application.lga} />
                        <InfoItem label="Home Address" value={data?.application.hometown_address} />
                        <InfoItem label="Contact Address" value={data?.application.contact_address} />
                        <InfoItem label="Disability" value={data?.application.disability} />
                     </ul>
                  </div>
               </Card>
            </div>
         </div>

         {/* Sponsor and Status Section */}
         <div className="grid sm:grid-cols-2 row-auto gap-7">
            <SponsorInfo application={data.application} />
            <AdmissionStatus data={data} />
         </div>

         {/* Exam Results Section */}
         {Boolean(data.application.awaiting_result) ? (
            <div className="grid sm:grid-cols-1 gap-7">
               <Card className="p-7">
                  <div className="p-20 flex items-center justify-center font-semibold text-2xl text-red-800">
                     Awaiting Result!!!
                  </div>
               </Card>
            </div>
         ) : (
            <div className="grid sm:grid-cols-2 gap-7">
               <ExamSittingDetails
                  sitting={firstSitting}
                  title="EXAM FIRST SITTING DETAILS"
                  resultImg={firstSitting?.first_sitting_result}
               />
               <ExamSittingDetails
                  sitting={secondSitting}
                  title="EXAM SECOND SITTING DETAILS"
                  resultImg={secondSitting?.second_sitting_result}
               />
            </div>
         )}

         {/* Admission Actions Section */}
         <div className="grid sm:grid-cols-1 gap-7">
            <AdmissionActionButtons
               id={id}
               status={data.admission_status}
               facultyId={data.faculty_id}
               departmentId={data.department_id}
            />
         </div>
      </div>
   );
};

export default StudentApplicationDetails;
