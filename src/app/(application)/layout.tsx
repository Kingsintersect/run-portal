import Header from '@/components/Header';
import { SITE_NAME } from '@/config';
import { AdmissionProvider } from '@/contexts/AdmissionContext'
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
   title: `${SITE_NAME} - Purchase Admission Form`,
   description: "Fill the form below to purchace admission form",
};

const Layout = ({ children }: { children: ReactNode }) => {
   return (
      <AdmissionProvider>
         <main className='account'>
            <div className="account-container">
               <div className="wrapper">
                  <Header />
                  {children}
               </div>
            </div>
         </main>
      </AdmissionProvider>
   )
}

export default Layout