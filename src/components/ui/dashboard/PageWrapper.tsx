import React, { ReactNode } from 'react'

const PageWrapper = ({ children }: { children: ReactNode }) => {
   return (
      <div className='flex flex-1 flex-col gap-4 p-4 min-w-0 overflow-hidden'> {/* ADD min-w-0 and overflow-hidden */}
         {children}
      </div>
   )
}

export default PageWrapper