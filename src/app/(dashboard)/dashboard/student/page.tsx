"use client";

import StudentBanner from "./componenets/StudentBanner";
import { AdmissionStatus, StatusCheckCard } from "./componenets/Status";
// import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Roles } from "@/config";
import { CalendarWidget } from "../components/calendar-widget";
import { CourseProgress } from "../components/course-progress";
import { UpcomingAssignments } from "../components/upcoming-assignments";
import dynamic from 'next/dynamic';
import { StatusType } from "@/config/Types";

const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), { ssr: false });

const StudentHome = () => {
   const { user } = useAuth();
   const student = user;
   const today = new Date();

   const events = [
      {
         id: "1",
         title: "Advanced Calculus Lecture",
         time: "9:00 AM",
         type: "class" as const,
      },
      {
         id: "2",
         title: "Term Paper Submission",
         time: "11:00 AM",
         type: "assignment" as const,
      },
      {
         id: "3",
         title: "Study Group Meeting",
         time: "2:30 PM",
         type: "meeting" as const,
      },
      {
         id: "4",
         title: "Physics Mid-term Exam",
         time: "4:00 PM",
         type: "exam" as const,
      },
   ];

   const courses = [
      {
         id: "1",
         name: "Advanced Calculus",
         code: "MATH 301",
         progress: 75,
         instructor: "Dr. Smith",
      },
      {
         id: "2",
         name: "Physics II",
         code: "PHYS 202",
         progress: 60,
         instructor: "Dr. Johnson",
      },
      {
         id: "3",
         name: "Introduction to AI",
         code: "CS 415",
         progress: 85,
         instructor: "Prof. Williams",
      },
      {
         id: "4",
         name: "Modern Literature",
         code: "LIT 205",
         progress: 45,
         instructor: "Dr. Davis",
      },
   ];

   const assignments = [
      {
         id: "1",
         title: "Term Paper: Quantum Mechanics",
         course: "PHYS 202",
         dueDate: "Today",
         status: "in-progress" as const,
      },
      {
         id: "2",
         title: "Problem Set 5",
         course: "MATH 301",
         dueDate: "Tomorrow",
         status: "not-started" as const,
      },
      {
         id: "3",
         title: "Literary Analysis Essay",
         course: "LIT 205",
         dueDate: "May 10",
         status: "not-started" as const,
      },
      {
         id: "4",
         title: "AI Project Proposal",
         course: "CS 415",
         dueDate: "May 12",
         status: "completed" as const,
      },
   ];

   return (
      <ProtectedRoute allowedRoles={[Roles.STUDENT]}>
         {student && (
            <div className=" pb-10">
               <div className=" text-gray-600 space-y-7">
                  {/* Welcome Banner */}
                  <StudentBanner student={student} />
                  {/* Status Cards */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 py-10">
                     <StatusCheckCard
                        admission={student.admission_status}
                        url="#"
                        // url="/admission/application/payment"
                        dataStatus={student.application_payment_status as StatusType}
                        title={"APPLICATION FEE"}
                     />

                     <AdmissionStatus
                        admissionStatus={student.admission_status}
                     />

                     <StatusCheckCard
                        admission={student.admission_status}
                        url="/dashboard/student/history/student-payments/acceptance"
                        dataStatus={student.acceptance_fee_payment_status as StatusType}
                        title={"ACCEPTANCE FEE"}
                     />

                     <StatusCheckCard
                        admission={student.admission_status}
                        url="/dashboard/student/history/student-payments/tuition"
                        dataStatus={student.tuition_payment_status as StatusType}
                        title={"TUITION FEE"}
                     />
                  </div>
                  {/* Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="space-y-6">
                        <CalendarWidget date={today} events={events} />
                        <CourseProgress courses={courses} />
                     </div>
                     <div>
                        <UpcomingAssignments assignments={assignments} />
                     </div>
                  </div>
               </div>
            </div>
         )}
      </ProtectedRoute>
   );
}

export default StudentHome
