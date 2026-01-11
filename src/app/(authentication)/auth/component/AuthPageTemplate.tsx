import AppLogo from '@/components/application/AppLogo';
import { Section } from '@/components/application/Section';
import Header from '@/components/Header';
import React, { ReactNode } from 'react'

interface AuthPageTemplateProps {
   title: string,
   children: ReactNode;
   params?: { slug: string },
   searchParams?: { [key: string]: string },
   subTitle?: string;
}

const AuthPageTemplate: React.FC<AuthPageTemplateProps> = ({ title, subTitle, children }) => {
   return (
      <main className='account'>
         <Header />
         <div className="account-container">
            <div className="wrapper">
               <Section classList='mx-0 p-0 h-screen text-black bg-gray-200' title={''}>
                  <div className="flex h-full">
                     <div className="md:basis-2/3 hidden md:block">
                        <div className="flex items-center h-full justify-center">
                           <AppLogo image_url={'/logo/logo.jpg'} classList='' Img_container_style='w-52 h-52' />
                        </div>
                     </div>
                     <div className="w-full sm:basis-3/3 md:basis-1/3 bg-white">
                        <div className="flex flex-col items-center justify-center h-full px-7 sm:px-5 md:px-14">
                           <div className="w-full mb-7 text-left">
                              <h1 className="text-3xl tracking-tight font-bold text-site-b mb-2">
                                 {title}
                              </h1>
                              <p className="text-base text-site-a font-bold">{subTitle}</p>
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

export default AuthPageTemplate
