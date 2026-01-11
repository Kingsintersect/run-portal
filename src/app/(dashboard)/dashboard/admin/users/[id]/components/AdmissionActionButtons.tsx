import GrantStudentAdmissionModal from '@/components/application/GrantStudentAdmissionModal';
import RejectStudentAdmissionModal from '@/components/application/RejectStudentAdmissionModal';
import { Card } from '@/components/ui/card';
import { AdmissionStatusType } from '@/config/Types';
import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react'

interface AdmissionActionButtonsProps {
    id: string;
    status: AdmissionStatusType;
    facultyId: string;
    departmentId: string;
}

const AdmissionActionButtons = ({ id, status, facultyId, departmentId }: AdmissionActionButtonsProps) => {
    if (status === "PENDING") {
        return (
            <Card className="p-7">
                <div className="flex items-center justify-between">
                    <RejectStudentAdmissionModal id={id} modalSize={'2xl'} />
                    <GrantStudentAdmissionModal id={id} faculty_id={facultyId} department_id={departmentId} />
                </div>
            </Card>
        );
    } else if (status === "NOT_ADMITTED") {
        return (
            <Card className="p-7">
                <div className="flex items-center justify-around">
                    <div className="text-3xl font-semibold text-gray-700">ADMISSION DENIED</div>
                    <XCircle className="h-14 w-14 text-red-400 dark:text-red-200" />
                </div>
            </Card>
        );
    } else {
        return (
            <Card className="p-7">
                <div className="flex items-center justify-around">
                    <div className="text-3xl font-semibold text-gray-700">ADMISSION GRANTED</div>
                    <CheckCircle className="h-14 w-14 text-green-400 dark:text-green-200" />
                </div>
            </Card>
        );
    }
}

export default AdmissionActionButtons
