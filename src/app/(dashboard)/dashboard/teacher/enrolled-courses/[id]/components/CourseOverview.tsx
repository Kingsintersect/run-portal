import { Calendar, Clock, Mail, Users } from 'lucide-react'
import React from 'react'
import { courseData } from '../../../data'

export const CourseOverview = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Description */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                        <p className="text-gray-700 leading-relaxed">{courseData.description}</p>
                    </div>
                </div>

                {/* Course Info */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Course Information</h2>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                                <p className="font-medium">{courseData.schedule.days}</p>
                                <p className="text-sm text-gray-600">{courseData.schedule.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                                <p className="font-medium">{courseData.schedule.location}</p>
                                <p className="text-sm text-gray-600">{courseData.schedule.credits} Credits</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Users className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                                <p className="font-medium">{courseData.enrolled}/{courseData.capacity} Students</p>
                                <p className="text-sm text-gray-600">Enrolled</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructor Details */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Instructor</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium text-lg">{courseData.instructor.name}</p>
                        <div className="flex items-center mt-2">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <a href={`mailto:${courseData.instructor.email}`} className="text-blue-600 hover:text-blue-800">
                                {courseData.instructor.email}
                            </a>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-600">{courseData.instructor.office}</p>
                        <p className="text-gray-600">Office Hours: {courseData.instructor.officeHours}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
