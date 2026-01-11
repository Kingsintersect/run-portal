// import { User } from 'lucide-react'
import { SiteBlock } from '@/components/site-block'
import Image from 'next/image'
import React from 'react'

export const WelcomeBlock = () => {
    return (
        <SiteBlock>
            <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back, Dr. Sarah Wilson!</h1>
                <p className="text-blue-100 mb-4">Here's what's happening in your courses today</p>
                {/* <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                          <BookOpen size={16} />
                          <span>3 Active Courses</span>
                      </div>
                      <div className="flex items-center space-x-2">
                          <FileText size={16} />
                          <span>15 Pending to Grade</span>
                      </div>
                      <div className="flex items-center space-x-2">
                          <MessageSquare size={16} />
                          <span>8 Unread Messages</span>
                      </div>
                  </div> */}
            </div>
            <div className="hidden md:block">
                <div className="relative w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    {/* <User size={40} className="text-white" /> */}
                    <Image
                        src="/avatars/avatar-woman.jpg"
                        alt="Teacher Avatar"
                        fill
                        className="absolute inset-0 w-full h-full rounded-full object-cover"
                    />
                </div>
            </div>
        </SiteBlock>
    )
}
