"use client";
// import { Pagination } from 'flowbite-react';
import React, { useState } from 'react'

const AppPagination = () => {
   const [currentPage, setCurrentPage] = useState(1);

   const onPageChange = (page: number) => setCurrentPage(page);

   return (
      <div className="w-full">
         {/* <Pagination className='flex items-center justify-between' layout="table" currentPage={currentPage} totalPages={100} onPageChange={onPageChange} showIcons /> */}
      </div>
   );
}

export default AppPagination