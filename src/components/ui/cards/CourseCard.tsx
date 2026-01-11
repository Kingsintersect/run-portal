import { FC, useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Mail, Phone, ArrowRight, Info, Calendar } from 'lucide-react'

type Lecturer = {
    image_url: string
    name: string
    email: string
    phone: string
}

interface CourseCardProps {
    url?: string
    image_url: string
    title: string
    code: string
    credit: string
    instructor: Lecturer | null
}

const CourseCard: FC<CourseCardProps> = ({ url, image_url, title, instructor, code, credit }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Link
            href={url ?? "#"}
            target="_blank"
            className="block group max-w-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 dark:border-gray-700 hover:cursor-pointer transform hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full h-32 overflow-hidden">
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-orange-500 to-teal-500 opacity-0 transition-opacity duration-300",
                    isHovered ? "opacity-30" : ""
                )} />
                <div className={cn(
                    "relative w-full h-full transition-all duration-500",
                    isHovered ? "scale-90" : "scale-100"
                )}>
                    <Image
                        src={image_url}
                        style={{ objectFit: "cover" }}
                        alt={title}
                        fill
                        className="rounded-t-xl"
                    />
                </div>
            </div>

            <div className="px-6 pt-4">
                <div className="flex flex-col mb-2">
                    <h5 className="font-bold text-[#6f1304] dark:text-[#c32c0c] mb-5 line-clamp-2">{title}</h5>
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                            <Info className="w-3 h-3 mr-1" />
                            CODE: {code}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            <Calendar className="w-3 h-3 mr-1" />
                            CREDIT: {credit}
                        </span>
                    </div>
                </div>

                {instructor && (
                    <div className="mt-4 flex items-center space-x-3">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-[#f8e9e7] dark:border-[#250704]">
                            <Image
                                src={instructor.image_url}
                                style={{ objectFit: "cover" }}
                                alt={instructor.name}
                                fill
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {instructor.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                Instructor
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {instructor && (
                <div className="px-6 py-3">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Mail className="w-4 h-4 mr-2 text-[#6f1304] dark:text-[#c32c0c]" />
                            <span className="truncate">{instructor.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Phone className="w-4 h-4 mr-2 text-[#6f1304] dark:text-[#c32c0c]" />
                            <span className="truncate">{instructor.phone}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-6 pb-4 pt-3">
                <div className={cn(
                    "flex items-center justify-center py-2 px-4 w-full rounded-lg font-medium transition-all duration-300",
                    "bg-transparent border text-teal-800 dark:text-teal-200",
                    "hover:from-[#8a1805] hover:to-[#c32c0c] group"
                )}>
                    <span className="mr-2">View Course</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}

export default CourseCard



