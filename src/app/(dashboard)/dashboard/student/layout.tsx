"use client";

import React, { ReactNode, useState } from 'react'
import { DraggableTranscriptReminder } from './componenets/ReminderAlart';
import { StudentStatusProvider } from '@/contexts/StudentStatusContext';
import { toast } from 'sonner';

type LayoutProps = {
   children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
   const [showPopup, setShowPopup] = useState(true);

   const handleClose = () => {
      setShowPopup(false);
      setTimeout(() => setShowPopup(true), 1800000);//30 minutes =  1,800,000 milliseconds, 1 hour = 3,600,000 milliseconds
   };

   const handleUpload = () => {
      toast.info('Opening transcript upload page...\n\nIn a real app, this would navigate to your upload form or open a file picker.');
      setShowPopup(false);
   };

   return (
      <div className='relative min-h-screen'>
         <StudentStatusProvider>
            {children}
            {!showPopup && (
               <button
                  onClick={() => setShowPopup(true)}
                  className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
               >
                  Show Reminder
               </button>
            )}
            <DraggableTranscriptReminder
               isVisible={showPopup}
               onClose={handleClose}
               onUploadClick={handleUpload}
            />
         </StudentStatusProvider>
      </div>
   )
}

export default Layout

