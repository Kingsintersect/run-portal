"use client"

import React, { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Book, CreditCard } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ContentLoader from "@/components/ui/content-loader"
import ContentEmpty from "@/components/ui/content-empty"
import StatusManagement from "./component/StatusManagementCard"
import { FetchSigleUser } from "@/app/actions/portal.actions"
import { extractErrorMessages } from "@/lib/errorsHandler"
import { useQuery } from "@tanstack/react-query"
import { PagePropsWithId } from "@/types/generic.types"
import { useAuth } from "@/contexts/AuthContext"
import { notify } from "@/contexts/ToastProvider"
import { FULL_TUITION_FEE } from "@/config"
import { UserInterface } from "@/config/Types"

// API service functions
const userService = {
    fetchUser: async (token: string, userId: string) => {
        const { error, success } = await FetchSigleUser(token, userId);
        if (error) throw new Error(extractErrorMessages(error).join(', '));
        if (success) return success.data;
        throw new Error('Failed to fetch user data');
    },
};

// Define the type for student data
interface Student extends UserInterface {
    department: string;
    level: string;
    admissionYear: string;
    profileImage: string;
    tuition_payment_amount: Record<string, { total: number; paid: number }>;
};

export default function UpdateStudentRecordPage({ params }: PagePropsWithId) {
    const { id: userId } = use(params);
    const { access_token } = useAuth();

    // Query for fetching user data
    const { data: student, isLoading, error: fetchError } = useQuery<Student>({
        queryKey: ['fetch_student_data', userId],
        queryFn: () => userService.fetchUser(access_token ?? "", userId),
        enabled: !!access_token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const getTotalStats = () => {
        if (!student) return { total: 0, paid: 0, remaining: 0, percentage: 0 };
        const total = FULL_TUITION_FEE;
        const paid = student.tuition_amount_paid ?? 0;
        const remaining = total - paid;
        const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;

        return { total, paid, remaining, percentage };
    };

    if (fetchError) {
        notify({ message: fetchError.message, variant: "error", timeout: 10000 });
    }

    return (
        <div className="container mx-auto py-6 mb-10 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-site-b-dark">UPDATE STUDENT RECORD</h1>
            </div>

            {isLoading ? (
                <ContentLoader />
            ) : student ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Student Profile Card */}
                    <Card className="border-cyan-100 shadow-md">
                        <CardHeader className="bg-gradient-to-r from-cyan-50 to-orange-50 rounded-t-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-cyan-800">{student.first_name + " " + student.last_name}</CardTitle>
                                    <CardDescription className="text-site-b-dark flex w-full item-center justify-between"><span className="font-bold inline-block mr-2">ID: </span> {student.id}</CardDescription>
                                    <CardDescription className="text-orange-600 flex w-full item-center justify-between"><span className="font-bold inline-block mr-2">REF. NO: </span> {student.reference}</CardDescription>
                                </div>
                                <Avatar className="h-16 w-16 border-2 border-orange-300">
                                    <AvatarImage src={student.pictureRef ?? "/avatars/avatar-man.jpg"} alt={student.first_name ?? ""} />
                                    <AvatarFallback className="bg-site-btext-site-b text-white">{student.first_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-site-b" />
                                    <span className="text-gray-600">Department:</span>
                                    <span className="font-medium">{student.department}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Book className="h-4 w-4 text-site-b" />
                                    <span className="text-gray-600">Level:</span>
                                    <span className="font-medium">{student.level}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-site-b-light" />
                                    <span className="text-gray-600">Admission Year:</span>
                                    <span className="font-medium">{student.admissionYear}</span>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h3 className="font-semibold text-site-b-dark mb-2">Payment Summary</h3>
                                <hr />
                                <div className="space-y-4 mt-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">Payment Completion</span>
                                            <span className="text-sm font-medium">{getTotalStats().percentage}%</span>
                                        </div>
                                        <Progress value={getTotalStats().percentage} className="h-2 bg-cyan-100" />
                                    </div>

                                    <h2 className="text-lg mt-10 text-site-b-dark">TUITION FEE CHAT</h2>
                                    <hr />
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-orange-50 p-3 rounded-lg">
                                            <div className="text-xs text-site-a">Total Fees</div>
                                            <div className="text-lg font-semibold text-site-a-dark">₦{getTotalStats().total.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-cyan-50 p-3 rounded-lg">
                                            <div className="text-xs text-site-b-dark">Amount Paid</div>
                                            <div className="text-lg font-semibold text-site-b-dark">₦{getTotalStats().paid.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-cyan-50 p-3 rounded-lg col-span-2">
                                            <div className="text-xs text-site-b-dark">Outstanding Balance</div>
                                            <div className="text-lg font-semibold text-site-a-dark">₦{getTotalStats().remaining.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <div className="lg:col-span-2">
                        <StatusManagement studentData={student} />
                    </div>
                </div>
            ) : (
                <Card className="border-orange-100">
                    <CardContent className="pt-6">
                        <ContentEmpty />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}