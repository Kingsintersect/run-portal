"use client";
import { Button } from "@/components/ui/button";
import { UserInterface } from "@/config/Types";
import { useAuth } from "@/contexts/AuthContext";
import { ClipboardCopy, BookOpen, Building, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PageHeader = ({ student }: { student: UserInterface | null }) => {
   const { user, loading, initializeLogout } = useAuth();
   const [isClient, setIsClient] = useState(false);
   const [copied, setCopied] = useState(false);
   const [studentProgram, setStudentProgram] = useState<{ faculty?: string; department?: string; course_category?: string } | null>(null);

   useEffect(() => {
      if (typeof window !== "undefined") {
         setIsClient(true);
      }
   }, []);

   useEffect(() => {
      if (user && !loading) {
         setStudentProgram({
            faculty: user.program || "Not assigned",
            department: user.program || "Not assigned",
            course_category: user.program || "Not assigned",
         });
      }
   }, [user, loading]);

   const handleCopy = () => {
      if (isClient && student?.reg_number) {
         navigator.clipboard.writeText(student.reg_number);
         setCopied(true);
         setTimeout(() => {
            setCopied(false);
         }, 5000);
      }
   };

   if (!user && !loading) {
      return (
         <div className="w-full max-w-7xl mx-auto my-8">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
               <h2 className="text-xl font-bold">Access Denied</h2>
               <p className="mt-2">You must be logged in to view this page.</p>
               <Button
                  className="mt-4 bg-red-400 hover:bg-red-500 text-white"
                  onClick={initializeLogout}
                  asChild
               >
                  <Link href="/auth/signin">
                     Go to Login
                  </Link>
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full max-w-7xl mx-auto my-8">
         <div className="brown-gold rounded-t-2xl p-4 text-white">
            <h2 className="text-2xl font-bold tracking-tight">Learning Management System</h2>
            <p className="text-teal-100 mt-2">Welcome to your academic dashboard</p>
         </div>

         <div className="bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 p-6">
               {/* Study Information Panel */}
               <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-orange-800 dark:text-orange-300 mb-6 flex items-center">
                     <GraduationCap className="mr-3 h-7 w-7" />
                     Academic Information
                  </h3>

                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-lg">
                           <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-300" />
                        </div>
                        <div>
                           <div className="text-sm text-gray-500 dark:text-gray-400">Faculty</div>
                           <div className="font-medium text-lg">{studentProgram?.faculty}</div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                           <Building className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                           <div className="text-sm text-gray-500 dark:text-gray-400">Department</div>
                           <div className="font-medium text-lg">{studentProgram?.department}</div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                           <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                           <div className="text-sm text-gray-500 dark:text-gray-400">Level</div>
                           <div className="font-medium text-lg">{studentProgram?.course_category}</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Credentials Panel */}
               <div className="bg-gradient-to-br from-teal-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-teal-800 dark:text-teal-300 mb-6">
                     Access Credentials
                  </h3>

                  <div className="space-y-6">
                     <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Username</div>
                        <div className="flex items-center justify-between">
                           <div className="font-mono text-xl font-medium">{student?.reg_number || "Not assigned"}</div>
                           <Button
                              onClick={handleCopy}
                              disabled={!student?.reg_number}
                              className="bg-teal-600 hover:bg-teal-700 text-white transition-all"
                              size="sm"
                           >
                              <ClipboardCopy className="mr-2 h-4 w-4" />
                              {copied ? "Copied!" : "Copy"}
                           </Button>
                        </div>
                     </div>

                     <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Default Password</div>
                        <div className="flex items-center justify-between">
                           <div className="font-mono text-xl font-medium">P@55word</div>
                           <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                              Requires change on first login
                           </div>
                        </div>
                     </div>

                     <div className="text-center mt-2">
                        <Button className="bg-gradient-to-r from-teal-500 to-orange-600 hover:from-teal-600 hover:to-orange-700 text-white transition-all w-full" asChild>
                           <Link href="/dashboard/student">
                              <BookOpen className="mr-2 h-4 w-4" />
                              Go to Student Dashboard
                           </Link>
                        </Button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center text-sm text-gray-500 dark:text-gray-400 min-h-14">
               {/* Need help? Contact the IT Support at <span className="font-medium">support@university.edu</span> */}
            </div>
         </div>
      </div>
   );
};

export default PageHeader;