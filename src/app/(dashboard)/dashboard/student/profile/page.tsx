"use client";

import React, { useState } from "react";
import UploadAvatar from "./components/UploadAvatar";
import EditInfoForm from "./components/EditInfoForm";
import { ChangePasswordForm } from "./components/ChangePassword";
import { BookOpen, Lock, User, LogOut } from "lucide-react";
import { baseUrl } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ContentLoader from "@/components/ui/content-loader";

const StudentProfile = () => {
   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
   const { user, loading, initializeLogout } = useAuth();
   const baseLink = `${baseUrl}/dashboard/student`;

   const student = {
      avatar: "/avatar-placeholder.png",
   };

   if (loading) {
      return (
         <ContentLoader />
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
         <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="brown-gold rounded-t-2xl p-6 text-white">
               <h1 className="text-3xl font-bold tracking-tight">Student Profile</h1>
               <p className="text-blue-100 mt-2">Manage your personal information and settings</p>
            </div>

            {(user)
               ? <div className="bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                     {/* Sidebar */}
                     <aside className="lg:w-1/3 bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
                        <div className="sticky top-6">
                           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-10">
                              <UploadAvatar imageUrl={student.avatar} />

                              <div className="mt-4 text-center">
                                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {user.first_name + " " + user.last_name}
                                 </h2>
                                 <p className="text-teal-600 dark:text-teal-400 font-medium mt-1">
                                    {user.reg_number || "Student ID: CSC/2021/001"}
                                 </p>
                              </div>

                              <div className="mt-6">
                                 <button
                                    className="w-full brown-burgundy hover:from-orange-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    onClick={() => setIsPasswordModalOpen(true)}
                                 >
                                    <Lock className="h-5 w-5" />
                                    Change Password
                                 </button>
                              </div>
                           </div>

                           <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                              <div className="p-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                                 <h3 className="font-medium">Account Navigation</h3>
                              </div>
                              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                 <Link href="#profile" className="flex items-center gap-3 p-4 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 font-medium">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                 </Link>
                                 <Link href={`${baseLink}/enrolled-courses`} className="flex items-center gap-3 p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <BookOpen className="h-5 w-5" />
                                    My Courses
                                 </Link>
                                 {/* <Link href="#notifications" className="flex items-center gap-3 p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <Bell className="h-5 w-5" />
                                    Notifications
                                 </Link>
                                 <Link href="#settings" className="flex items-center gap-3 p-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <Settings className="h-5 w-5" />
                                    Account Settings
                                 </Link> */}
                                 <button
                                    className="w-full flex items-center gap-3 p-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                    onClick={initializeLogout}
                                 >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                 </button>
                              </div>
                           </nav>
                        </div>
                     </aside>

                     {/* Main Content */}
                     <main className="lg:w-2/3 p-6 lg:p-8">
                        <section id="profile" className="mb-8">
                           <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-1 rounded-xl">
                              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                 <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                                    <User className="mr-2 h-5 w-5 text-orange-600" />
                                    Profile Information
                                 </h3>

                                 <EditInfoForm
                                    student={{
                                       id: user.id as number,
                                       first_name: user.first_name as string,
                                       last_name: user.last_name as string,
                                       other_name: user.other_name as string,
                                       email: user.email as string,
                                       phone_number: user.phone_number as string,
                                    }}
                                 />
                              </div>
                           </div>
                        </section>

                        <section>
                           <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 shadow-sm">
                              <h3 className="text-lg font-medium mb-3 text-teal-800 dark:text-teal-300">Recent Activity</h3>
                              <p className="text-gray-600 dark:text-gray-400">
                                 Your account was last accessed on April 14, 2025 at 15:42 PM.
                              </p>
                           </div>
                        </section>
                     </main>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500">
                     © 2025 Enugu State University of Science and Technology - Student Learning Management System • <Link href="#" className="text-orange-600 hover:underline">Privacy Policy</Link> • <Link href="#" className="text-orange-600 hover:underline">Terms of Service</Link>
                  </div>
               </div>
               : <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No Student Found</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                     It seems like you dont have a student profile yet. Please contact your administrator to set up your account.
                     <br />
                     OR
                     <br />
                     Your session has expired. Please reauthenticate to continue...
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                     <Link href="/auth/signin" className="text-blue-600 hover:underline">Reauthenticate</Link>
                  </p>
               </div>
            }
         </div>

         {/* Password Change Modal */}
         <ChangePasswordForm
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
         />
      </div>
   );
};

export default StudentProfile;
