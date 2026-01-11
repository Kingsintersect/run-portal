"use client";

import { ApproveStudentAdmission } from "@/app/actions/admin";
import { GetSingleDepartment, GetSingleFaculty } from "@/app/actions/server.admin";
import { baseUrl } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { notify } from "@/contexts/ToastProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTrigger,
} from "@/components/ui/dialog"
import { Department, Faculty } from "@/config/Types";

const GrantStudentAdmissionModal = ({ id, faculty_id, department_id }: { confirmHandler?: () => void, id: any, faculty_id: string | null, department_id: string | null }) => {
   const [openModal, setOpenModal] = useState(false);
   const [facultyData, setFacultyData] = useState<Faculty | null>(null)
   const [departmentData, setDepartmentData] = useState<Department | null>(null)
   const { access_token } = useAuth();
   const router = useRouter();

   const handleApproval = async () => {
      setOpenModal(false)
      if (access_token) {
         const { error, success } = await ApproveStudentAdmission(access_token, { application_id: id, faculty_id: faculty_id, department_id: department_id, semester: "1SM" });
         if (error) {
            console.log('errors', error);
            notify({ message: "Their was an erorr trying to approve admission!", variant: "error", timeout: 5000 });
            return;
         }
         if (success) {
            notify({ message: "Student admission is confirmed", variant: "success", timeout: 5000 });
            router.push(`${baseUrl}/dashboard/admin/users/student-applications`);
            router.refresh();
            return;
         }
      } else {
         router.push(`${baseUrl}/auth/signin`);
         router.refresh();
      }
   }

   const handleOpenModal = (state: boolean) => {
      setOpenModal(state)
   }

   useEffect(() => {
      const fetchData = async () => {
         if (access_token && department_id && faculty_id) {
            try {
               const [faculty, department] = await Promise.all([
                  GetSingleFaculty(access_token, faculty_id),
                  GetSingleDepartment(department_id, access_token),
               ]);
               setFacultyData(faculty.success.data);
               setDepartmentData(department.success.data);
            } catch (error) {
               console.error('Error fetching data:', error);
            }
         }
      };

      fetchData();
   }, [access_token, department_id, faculty_id]);



   return (
      <>
         <Dialog>
            <DialogTrigger>
               <Button color={"success"} onClick={() => handleOpenModal(true)}>Approve Admission</Button>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400 dark:text-green-200" />
                  <h3 className="mb-5 text-lg font-normal text-green-500 dark:text-green-400">
                     Confirm Admission Approval
                  </h3>
               </DialogHeader>
               <div className="w-full space-y-5 my-10 text-left">
                  <div className="flex flex-row gap-5">
                     <div className="w-32 font-bold text-lg text-orange-950">FACULTY: </div>
                     <div className="grow text-gray-700">{facultyData && facultyData.faculty_name}</div>
                  </div>
                  <div className="flex flex-row gap-5">
                     <div className="w-32 font-bold text-lg text-orange-950">DEPARTMENT: </div>
                     <div className="grow text-gray-700">{departmentData && departmentData.department_name}</div>
                  </div>
                  <div className="flex flex-row gap-5">
                     <div className="w-32 font-bold text-lg text-orange-950">SEMESTER: </div>
                     <div className="grow text-gray-700">{"1st Semester"}</div>
                  </div>
               </div>
               <hr />
               <div className="flex justify-center gap-4 my-4">
                  <Button color="gray" onClick={() => handleOpenModal(false)}>
                     No, cancel
                  </Button>
                  <Button color="success" onClick={() => handleApproval()}>
                     {"Yes, I'm sure"}
                  </Button>
               </div>
            </DialogContent>
         </Dialog>

         {/* <Modal show={openModal} size="lg" onClose={() => handleOpenModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
               <div className="text-center">
                  <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400 dark:text-green-200" />
                  <h3 className="mb-5 text-lg font-normal text-green-500 dark:text-green-400">
                     Confirm Admission Approval
                  </h3>
                  <div className="w-full space-y-5 my-10 text-left">
                     <div className="flex flex-row gap-5">
                        <div className="w-32 font-bold text-lg text-orange-950">FACULTY: </div>
                        <div className="grow text-gray-700">{facultyData && facultyData.faculty_name}</div>
                     </div>
                     <div className="flex flex-row gap-5">
                        <div className="w-32 font-bold text-lg text-orange-950">DEPARTMENT: </div>
                        <div className="grow text-gray-700">{departmentData && departmentData.department_name}</div>
                     </div>
                     <div className="flex flex-row gap-5">
                        <div className="w-32 font-bold text-lg text-orange-950">SEMESTER: </div>
                        <div className="grow text-gray-700">{"1st Semester"}</div>
                     </div>
                  </div>
                  <hr />
                  <div className="flex justify-center gap-4 my-4">
                     <Button color="gray" onClick={() => handleOpenModal(false)}>
                        No, cancel
                     </Button>
                     <Button color="success" onClick={() => handleApproval()}>
                        {"Yes, I'm sure"}
                     </Button>
                  </div>
               </div>
            </Modal.Body>
         </Modal> */}
      </>
   );
}

export default GrantStudentAdmissionModal

