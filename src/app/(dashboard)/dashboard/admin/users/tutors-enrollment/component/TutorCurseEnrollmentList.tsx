"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2, Trash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from "@/contexts/ToastProvider";
import { extractErrorMessages } from "@/lib/errorsHandler";
import { Button } from "@/components/ui/button";
import { DeleteSingleCourseEnrolledByTutor, FetchAllCourseEnrolledByTutor } from "@/app/actions/tutorEnrollment.api";
import { GenericDataType } from '@/types/generic.types';

const TutorCourseEnrollmentList = ({ tutorId }: { tutorId: string }) => {
    const { access_token } = useAuth();;
    const [courses, setCourses] = useState([]);
    const [tutor, setTutor] = useState<GenericDataType[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setdeleting] = useState(false);

    const fetchData = async (access_token: string, tutorId: string) => {
        try {
            setLoading(true);
            const { success, error } = await FetchAllCourseEnrolledByTutor(access_token, tutorId);
            if (success?.data) {
                setCourses(success.data.enrollments || []);
                setTutor(success.data.tutor || null);
            }
            if (error) {
                const errorMessages = extractErrorMessages(error);
                errorMessages.forEach((msg) => {
                    notify({ message: msg, variant: "error", timeout: 5000 });
                });
                return;
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseEnrollementDelete = async (enrollmentId: string) => {
        try {
            if (!access_token) {
                notify({ message: "Token is missing", variant: "error", timeout: 5000 });
                return;
            }
            setdeleting(true);
            const { success, error } = await DeleteSingleCourseEnrolledByTutor(access_token, enrollmentId, tutorId);
            if (success) {
                notify({ message: "Course Enrolled Deleted Successfully", variant: "success", timeout: 5000 });
                setCourses([]);
                fetchData(access_token, tutorId);
            }
            if (error) {
                const errorMessages = extractErrorMessages(error);
                errorMessages.forEach((msg) => {
                    notify({ message: msg, variant: "error", timeout: 10000 });
                });
                return;
            }
        } catch (error) {
            console.error("Error deleting course enrolled:", error);
        } finally {
            setdeleting(false);
        }
    };

    useEffect(() => {
        if (access_token) fetchData(access_token, tutorId);
    }, [tutorId, access_token]);

    if (loading) {
        return <p className="flex items-center justify-center"><Loader2 className="animate-spin" /></p>;
    }

    return (
        <div className="flex flex-col space-y-4 bg-white p-10 rounded-md shadow-md">
            <h2 className="text-xl font-bold text-[#23628d]">Courses Enrolled</h2>
            <hr />
            {courses.length > 0 ? (
                <div className="px-10">
                    <Table className="w-full text-sm px-10">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-medium p-1">Course Code</TableHead>
                                <TableHead className="p-1">Course Title</TableHead>
                                <TableHead className="p-1">Faculty Name</TableHead>
                                <TableHead className="p-1">Department Name</TableHead>
                                <TableHead className="p-1">Programme</TableHead>
                                <TableHead className="p-1">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((item: GenericDataType) => (
                                <TableRow key={item.enrolment_id}>
                                    <TableCell className="font-medium p-1">{item.course?.course_code}</TableCell>
                                    <TableCell className="p-1">{item.course?.course_title}</TableCell>
                                    <TableCell className="p-1">{item.faculty?.faculty_name}</TableCell>
                                    <TableCell className="p-1">{item.department?.department_name}</TableCell>
                                    <TableCell className="p-1">{item.programme}</TableCell>
                                    <TableCell className="p-1">
                                        <Button
                                            variant={"destructive"}
                                            className="flex items-center border border-red-500 text-red-500 px-2 py-1 rounded-md"
                                            onClick={() => handleCourseEnrollementDelete(item.enrolment_id)}
                                        >
                                            Drop
                                            {
                                                (deleting)
                                                    ? (<Loader2 className="animate-spin" />)
                                                    : (<Trash className="mr-2 h-4 w-4" />)
                                            }
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-red-300 text-center text-lg">No Course Enrolled</p>
            )}
        </div>
    );
}

export default TutorCourseEnrollmentList
