"use client";
import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export const StudentInfo = React.memo(() => {
    const { user } = useAuth();
    const { first_name, last_name, pictureRef, reg_number, email, department_id } = user || {};
    const fullname = first_name + " " + last_name;
    const department = department_id;
    const enrollmentYear = 2025;
    const profileImage = pictureRef ?? "/avatars/avatar-man.jpg";

    return (
        <div className="p-6 border-b">
            <div className="flex items-center gap-7">
                <div className="space-y-3 w-1/4 flex flex-col items-center justify-center">
                    {profileImage && (
                        <div className="relative w-24 h-24 rounded-full mr-6 border-2 border-gray-200">
                            <Image
                                src={profileImage}
                                alt={fullname}
                                fill
                                sizes="96px"
                                priority
                                className="object-cover rounded-full"
                            />
                        </div>
                    )}
                    <h2 className="text-lg text-[#750303] uppercase text-center font-bold">{fullname}</h2>
                </div>
                <div className='w-full'>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-4 mt-2">
                        <div>
                            <p className="text-teal-600 font-bold">Reg Number:</p>
                            <p className="text-wrap">{reg_number}</p>
                        </div>
                        <div>
                            <p className="text-teal-600 font-bold">Program:</p>
                            <p className="text-wrap">{department}</p>
                        </div>
                        <div>
                            <p className="text-teal-600 font-bold">Email:</p>
                            <p className="text-wrap">{email}</p>
                        </div>
                        <div>
                            <p className="text-teal-600 font-bold">Year:</p>
                            <p>{new Date().getFullYear() - enrollmentYear + 1}th Year</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
});

StudentInfo.displayName = 'StudentInfo';