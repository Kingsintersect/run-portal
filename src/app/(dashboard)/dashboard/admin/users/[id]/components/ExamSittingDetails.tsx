import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ImageModal } from '@/components/application/ImageModal'

interface Grade {
    subject: string;
    Grade: string;
}

interface ExamSitting {
    type: string;
    exam_number: string;
    year: string;
    first_sitting_grade?: Grade[];
    second_sitting_grade?: Grade[];
}

interface ExamSittingDetailsProps {
    sitting: ExamSitting;
    title: string;
    resultImg: string;
}

const ExamSittingDetails = ({ sitting, title, resultImg }: ExamSittingDetailsProps) => {

    return (
        <Card className="p-5 bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="h-auto space-y-4">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h5>
                <div className="font-normal text-gray-700 dark:text-gray-400 mb-5">
                    <div className="grid grid-cols-1 space-y-7 justify-center">
                        <ul className="w-full space-y-2 text-sm text-gray-700">
                            <li className="p-2 bg-gray-100 rounded">{sitting?.type}</li>
                            <li className="p-2 bg-gray-100 rounded">{sitting?.exam_number}</li>
                            <li className="p-2 bg-gray-100 rounded">{sitting?.year}</li>
                        </ul>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableCaption>Subject And Grades</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Grade</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sitting?.first_sitting_grade && sitting?.first_sitting_grade.map((sit, i) => (
                                        <TableRow key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{sit.subject}</TableCell>
                                            <TableCell>{sit.Grade}</TableCell>
                                        </TableRow>
                                    ))}
                                    {sitting?.second_sitting_grade && sitting?.second_sitting_grade.map((sit, i) => (
                                        <TableRow key={i} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{sit.subject}</TableCell>
                                            <TableCell>{sit.Grade}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <hr />
                {resultImg && (
                    <ImageModal img_url={resultImg}>
                        <div className="group relative w-auto min-h-[330px] mt-10 cursor-pointer">
                            <Image
                                src={resultImg}
                                fill
                                style={{ objectFit: "contain" }}
                                className="transition-transform duration-300 ease-in-out group-hover:scale-95"
                                alt="Exam Result"
                            />
                        </div>
                    </ImageModal>
                )}
            </div>
        </Card>
    )
}

export default ExamSittingDetails
