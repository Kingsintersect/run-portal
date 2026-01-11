import AppLogo from '@/components/application/AppLogo';
import { Section } from '@/components/application/Section';
import Header from '@/components/Header';
import { SITE_NAME } from '@/config';
import { Metadata, NextPage } from 'next';
import Link from 'next/link';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
   title: `${SITE_NAME} - Purchase Admission Form`,
   description: "Purchase your adminission form to apply for admission into the university.",
};

type LayoutProps = {
   children: ReactNode
}

const Layout: NextPage<LayoutProps> = ({ children }: LayoutProps) => {

   return (
      <main className='account'>
         <Header />
         <div className="account-container">
            <div className="wrapper">
               <Section classList='mx-0 p-0 h-screen text-black bg-gray-200' title={''}>
                  <div className="flex h-full">
                     <div className="md:basis-2/6 hidden md:block bg-gradient-to-br from-site-a/50  from-10% to-site-b  to-90%">
                        <div className="flex items-center h-full justify-center">
                           <AppLogo image_url={'/logo/logo.jpg'} classList='' Img_container_style='w-52 h-52' />
                        </div>
                     </div>
                     <div className="w-full sm:basis-3/3 md:basis-4/6 bg-white">
                        <div className="flex flex-col items-center justify-center h-full px-7 sm:px-10 md:px-20 lg:px-32">
                           <div className="w-full text-start mb-10 font-bold text-xl space-x-3 text-site-b">
                              <span>Have an account ?</span>
                              <Link href={"/auth/signin"} className="text-site-a font-semibold"> Please signin</Link>
                           </div>
                           {children}
                        </div>
                     </div>
                  </div>
               </Section>
            </div>
         </div>
      </main>
   )
}

export default Layout