import { Button } from '@/components/ui/button';
import { BookMarked } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { courses } from '../data';

const EnrolledCoursesPage = () => {

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                {/* <button className="bg-site-b text-white px-4 py-2 rounded-lg hover:bg-site-b-dark flex items-center space-x-2">
                    <Plus size={16} />
                    <span>Add Course</span>
                </button> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-4">
                            <BookMarked className="text-site-b" size={20} />
                            <h3 className="font-bold text-gray-900">{course.name}</h3>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Students: {course.students}</p>
                            <p>Progress: {course.progress}%</p>
                        </div>
                        <Button className="w-full mt-4 bg-site-b text-white py-2 rounded-lg hover:bg-site-b-dark" asChild>
                            <Link href={`/dashboard/teacher/enrolled-courses/${course.id}`}>
                                Manage Course
                            </Link>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EnrolledCoursesPage
