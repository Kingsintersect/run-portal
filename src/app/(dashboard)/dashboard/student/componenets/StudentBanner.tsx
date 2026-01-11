"use client";
import { ClipboardCopy } from "lucide-react";
import { useEffect, useState } from "react";
import AdmissionDeniedBanner from "./AdmissionDeniedBanner";
import { baseUrl } from "@/config";
import { useRouter } from "next/navigation";
import Typewriter from "@/components/TypeWritter";
import { Button } from "@/components/ui/button";
import { UserInterface } from "@/config/Types";

const navigation = {
   applicationFormUrl: `${baseUrl}/admission/form`,
   acceptanceFeeUrl: `${baseUrl}/dashboard/student/history/student-payments/acceptance`,
   tuitionFeeUrl: `${baseUrl}/dashboard/student/history/student-payments/tuition`,
}

const StudentBanner = ({ student }: { student: UserInterface }) => {
   const [isClient, setIsClient] = useState(false);
   const [copied, setCopied] = useState(false);
   const [goto, setGoto] = useState('');
   const router = useRouter();

   useEffect(() => {
      setIsClient(true);
   }, []);

   useEffect(() => {
      if (!student) return;

      if (student.is_applied === 0) {
         setGoto(navigation.applicationFormUrl);
         return;
      } else if (student.acceptance_fee_payment_status === "UNPAID") {
         setGoto(navigation.acceptanceFeeUrl);
         return;
      } else if (student.tuition_payment_status === "UNPAID") {
         setGoto(navigation.tuitionFeeUrl);
         return;
      }
   }, [student]);

   const handleCopy = () => {
      if (isClient && student.reg_number) {
         navigator.clipboard.writeText(student.reg_number);
         setCopied(true);
         setTimeout(() => {
            setCopied(false)
         }, 5000)
      }
   }

   const handleGoTo = () => {
      router.push(goto);
   }
   return (
      <>
         {student.admission_status === "NOT_ADMITTED" ?
            <AdmissionDeniedBanner statement={student.reason_for_denial as string} />
            :
            <Banner>
               <div className="flex w-full flex-col justify-between border-b border-white bg-[#fffffb] p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row px-5 py-5 mb-5 rounded-md">
                  <div className="mb-4 md:mb-0 md:mr-4 max-w-xl">
                     <h2 className="text-2xl font-semibold text-gray-90 mb-3">Welcome <span className="text-cyan-600 inline-block ml-2">{student.first_name}</span></h2>
                     <h3 className="mb-1 text-xl font-semibold text-gray-90 text-[#23628d]">Education, Talent, And Career Opportunities. <br />
                        <Typewriter
                           className="text-[#d35401] mt-2 text-lg"
                           phrases={[
                              'All in one place...',
                              'Empowering Learning Through Technology.',
                              'Built for Modern Education.',
                              'Join the Future of Learning.',
                           ]}
                        />
                     </h3>
                     <p className="flex items-center font-normal text-gray-500">
                        Ready yourself with direct and knowledge rich online courses and make your career dreams a reality
                     </p>

                  </div>

                  <div className="flex shrink-0 items-center">
                     <div className="mr-3 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:text-cyan-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                        <div className="group min-h-20 min-w-40 grid grid-cols-1 gap-3 content-between p-5">
                           {(student.reg_number) ?
                              <>
                                 <div className="">
                                    <div className="text-center text-xl text-orange-800 font-bold">REG-NUMBER</div>
                                    <div className="text-center text-xl mt-3 mb-4 px-7 group-hover:text-orange-600">{student.reg_number}</div>
                                 </div>
                                 <Button onClick={handleCopy} size={"sm"}>
                                    <ClipboardCopy className="mr-2 h-4 w-4" /> {copied ? "copied" : "click to copy"}
                                 </Button>
                              </> :
                              <>
                                 <div className="text-xl">NO REG-NUMBER</div>
                                 <Button className="cursor-pointer" onClick={handleGoTo} size={"sm"}>
                                    click to continue registration
                                 </Button>
                              </>
                           }
                        </div>
                     </div>
                  </div>
               </div>
            </Banner>
         }
      </>

   );
}
export default StudentBanner

// #f9f9ee
const Banner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   return <div>{children}</div>;
}