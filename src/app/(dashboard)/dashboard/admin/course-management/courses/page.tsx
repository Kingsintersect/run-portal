"use client";
import Search from '@/components/ui/inputs/Search';
import { baseUrl } from '@/config';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { DataTable } from '@/components/ui/datatable/DataTable';
import { courses_columns } from './courses_table.columns';
import { GetListOfCourses } from '@/app/actions/server.admin';
import { filterData } from '@/lib/utils';
import ExportDropdown from '@/components/ExportDropdown';
import { useAuth } from '@/contexts/AuthContext';

export const dynamic = "force-dynamic";

const CoursesPage = () => {
   const [courses, setCourses] = useState<any[]>([]);
   const [filter, setFilter] = useState("ALL");
   const [searchQuery, setSearchQuery] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const { access_token } = useAuth();
   const basePath = `${baseUrl}/dashboard/admin/course-management/courses`;

   const fetchCourses = async (access_token: string) => {
      setLoading(true);
      setError(null); // Reset error state

      try {
         const { success, error } = await GetListOfCourses(access_token);
         if (success) {
            const sortedData = success.data.sort((a: any, b: any) => b.id - a.id);
            setCourses(sortedData);
         } else if (error) {
            setError(error.message || "Failed to fetch courses");
         }
      } catch {
         setError("An unexpected error occurred.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      let isMounted = true;
      if (access_token) {
         fetchCourses(access_token).catch(console.error);
         return () => { isMounted = false; }; // Cleanup on unmount
      }
   }, [access_token]);

   const filteredData = useMemo(() =>
      filterData(courses, "status", filter, ["course_title"], searchQuery),
      [filter, searchQuery, courses]
   )

   return (
      <>
         <Card className="mt-7 p-10">
            <header className="w-full flex items-center justify-between text-site-a font-bold">
               <h5 className="text-2xl font-bold tracking-tight text-[#23628d] dark:text-white mb-7">
                  Course List
               </h5>
               {courses && courses.length > 0 && (
                  <ExportDropdown
                     data={courses}
                     columns={
                        [
                           'course_title',
                           'course_code',
                           'description',
                           'image_url',
                        ]
                     }
                  />
               )}
            </header>
            <div className="font-normal text-gray-700 dark:text-gray-400 space-y-10 mb-7">
               <div className="grid sm:grid-cols-2 gap-3 md:gap-10">
                  <div className="search">
                     <Search
                        name={'search'}
                        placeholder='Search by name...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-3 rounded w-full"
                     />
                  </div>
                  <div className="search flex justify-end gap-5">
                     <Select
                        onValueChange={(value: string) => setFilter(value)}
                        defaultValue={filter}
                     >
                        <SelectTrigger className='w-[280px]'>
                           <SelectValue placeholder="SelectFilter Key" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="ALL">All Courses</SelectItem>
                           <SelectItem value="1">Active</SelectItem>
                           <SelectItem value="0">InActive</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               <div className="flex flex-col">
                  <div className="">
                     <Link href={`${basePath}/create`} >
                        <Button variant={'secondary'}>
                           <PlusIcon className="h-5 md:ml-4" />
                           Create New Course
                        </Button>
                     </Link>
                  </div>
               </div>
               <div className="grid grid-cols-1">
                  <DataTable columns={courses_columns} data={filteredData} />
               </div>
            </div>
         </Card>
      </>
   )
}

export default CoursesPage