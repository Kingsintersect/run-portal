"use client";
import React, { ReactNode } from 'react'
import {
   SidebarInset,
   SidebarProvider,
} from "@/components/ui/sidebar"
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/app-sidebar';
import SiteHeader from '@/components/site-header';

const MarginWidthWrapper = ({ children }: { children: ReactNode }) => {
   const { user, initializeLogout } = useAuth();
   return (
      <SidebarProvider>
         <AppSidebar user={user} />
         <SidebarInset className="overflow-x-hidden"> {/* ADD overflow-x-hidden */}
            <SiteHeader logout={initializeLogout} />
            <div className="min-w-0 w-full"> {/* ADD wrapper with min-w-0 */}
               {children}
            </div>
         </SidebarInset>
      </SidebarProvider>
   )
}

export default MarginWidthWrapper