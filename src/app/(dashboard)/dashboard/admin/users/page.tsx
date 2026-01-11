"use client";

import Search from '@/components/ui/inputs/Search'
import { Card } from '@/components/ui/card'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext";;
import { useState, useEffect, useMemo, useCallback } from 'react';
import ExportDropdown from '@/components/ExportDropdown';
import { fetchAllStudentApplications } from '@/app/actions/admin';
import { DataTable } from '@/components/ui/datatable/DataTable';
import { student_columns } from './student_table.columns';
import { GenericDataType } from '@/types/generic.types';

const paymentFilterOptions = [
   { label: "All", value: "all" },
   { label: "Paid Acceptance Fee", value: "paidacceptance" },
   { label: "Paid Part Tuition Fee", value: "partpaid" },
   { label: "Paid Full Tuition Fee", value: "paidtuition" },
];
const statusFilterOptions = [
   { label: "All", value: "all" },
   { label: "Pending Confirmation", value: "PENDING" },
   { label: "Applied", value: "applied" },
   { label: "Not Applied", value: "notapplied" },
   { label: "Admitted", value: "ADMITTED" },
   { label: "Not Admitted", value: "NOT_ADMITTED" },
];

const StudentApplications = () => {
   const { access_token } = useAuth();
   const [userData, setUserData] = useState<GenericDataType[]>([]);
   const [paymentFilter, setPaymentFilter] = useState<string | undefined>(undefined);
   const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
   const [isLoading, setIsLoading] = useState(false);

   const [searchQuery, setSearchQuery] = useState("");

   useEffect(() => {
      const getAlluser = async () => {
         if (access_token) {
            setIsLoading(true)
            const { success, error } = await fetchAllStudentApplications(access_token)
            if (success) {
               const descendingData = [...success.data].sort((a, b) => b.is_applied - a.is_applied);
               setUserData(descendingData);
               setIsLoading(false)
               return
            }
            if (error) {
               setIsLoading(false)
               console.error('Error Fetching user Data: ', error.message);
            }
         }
      }
      getAlluser();
   }, [access_token])

   const filterStudents = useCallback((students: GenericDataType[]) => {
      return students.filter((student) => {
         const matchesPayment =
            !paymentFilter || paymentFilter === "all" ||
            (paymentFilter === "paidacceptance" && student.acceptance_fee_payment_status === 1) ||
            (paymentFilter === "partpaid" && student.tuition_payment_status === 1 && +student.tuition_amount_paid < 195000) ||
            (paymentFilter === "paidtuition" && student.tuition_payment_status === 1 && +student.tuition_amount_paid === 195000);

         const matchesStatus =
            !statusFilter || statusFilter === "all" ||
            (statusFilter === "applied" && student.is_applied === 1) ||
            (statusFilter === "notapplied" && student.is_applied === 0) ||
            (statusFilter === "ADMITTED" && student.admission_status === "ADMITTED") ||
            (statusFilter === "PENDING" && student.admission_status === "PENDING" && student.is_applied === 1) ||
            (statusFilter === "NOT_ADMITTED" && student.admission_status === "NOT_ADMITTED");

         return matchesPayment && matchesStatus;
      });
   }, [paymentFilter, statusFilter]);


   const searchStudents = (students: GenericDataType[], query: string) => {
      if (!query) return students;

      const lowerQuery = query.toLowerCase();
      return students.filter((student) =>
         ["first_name", "last_name", "reference", "email"].some((key) => {
            const fullname1 = student.first_name + " " + student.last_name + " " + student.other_name;
            const fullname2 = student.first_name + " " + student.other_name + " " + student.other_name;
            const fullname3 = student.last_name + " " + student.first_name + " " + student.other_name;
            const fullname4 = student.last_name + " " + student.other_name + " " + student.other_name;
            const fullname5 = student.other_name + " " + student.first_name + " " + student.last_name;
            const fullname6 = student.other_name + " " + student.last_name + " " + student.first_name;

            return student[key]?.toLowerCase().includes(lowerQuery) ||
               fullname1.toLowerCase().includes(lowerQuery) ||
               fullname2.toLowerCase().includes(lowerQuery) ||
               fullname3.toLowerCase().includes(lowerQuery) ||
               fullname4.toLowerCase().includes(lowerQuery) ||
               fullname5.toLowerCase().includes(lowerQuery) ||
               fullname6.toLowerCase().includes(lowerQuery)
         })
      );
   };

   const filteredStudents = useMemo(() => {
      let result = filterStudents(userData);
      result = searchStudents(result, searchQuery);
      return result;
   }, [filterStudents, searchQuery, userData]);

   return (
      <>
         <Card className="mt-7 p-10">
            <header className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 text-site-a font-bold">
               <h5 className="text-xl sm:text-2xl font-bold tracking-tight text-[#23628d] dark:text-white">
                  ALL STUDENTS
               </h5>

               {userData && userData.length > 0 && (
                  <ExportDropdown
                     data={userData}
                     columns={[
                        "id",
                        "first_name",
                        "last_name",
                        "reference",
                        "admission_status",
                        "application_payment_status",
                        "acceptance_fee_payment_status",
                        "tuition_payment_status",
                        "email",
                        "phone_number",
                        "state",
                     ]}
                  />
               )}
            </header>

            <div className="font-normal text-gray-700 dark:text-gray-400 mb-7">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-10">
                  <div className="search">
                     <Search
                        name={'search'}
                        placeholder='Search by name or registration number...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded w-full"
                     />
                  </div>
                  <div className="search flex justify-end gap-5">
                     <Select onValueChange={setPaymentFilter} value={paymentFilter}>
                        <SelectTrigger className="w-[200px]">
                           <SelectValue placeholder="Payment Filter" />
                        </SelectTrigger>
                        <SelectContent>
                           {paymentFilterOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                 {option.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>

                     <Select onValueChange={setStatusFilter} value={statusFilter}>
                        <SelectTrigger className="w-[200px]">
                           <SelectValue placeholder="Admission Status Filter" />
                        </SelectTrigger>
                        <SelectContent>
                           {statusFilterOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                 {option.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="grid grid-cols-1">
                  <DataTable isLoading={isLoading} columns={student_columns} data={filteredStudents} />
               </div>
            </div>
         </Card>
      </>
   )
}

export default StudentApplications
