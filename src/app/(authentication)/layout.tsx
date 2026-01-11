import { SITE_NAME } from '@/config';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

export const metadata: Metadata = {
   title: `${SITE_NAME} - Purchase admission form`,
   description: "pay for adminssion form to fill he form",
};

type LayoutProps = {
   children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {

   return (
      <>{children}</>
   )
}

export default Layout