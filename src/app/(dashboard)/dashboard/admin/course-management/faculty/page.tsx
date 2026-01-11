
"use client";
import { baseUrl } from '@/config';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button"
import { GetListOfFaculties } from '@/app/actions/server.admin';
import { DataTable } from '@/components/ui/datatable/DataTable';
import { faculty_columns } from './faculty_table.columns';
import { Card } from '@/components/ui/card';
import ExportDropdown from '@/components/ExportDropdown';
import Search from '@/components/ui/inputs/Search';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { filterData } from '@/lib/utils';
import { GenericDataType } from '@/types/generic.types';

export const dynamic = 'force-dynamic';

const Faculty = () => {
   const [faculties, setFaculties] = useState<GenericDataType[]>([]);
   const [filter, setFilter] = useState("ALL");
   const [searchQuery, setSearchQuery] = useState("");
   const [error, setError] = useState<string | null>(null);
   const basePath = `${baseUrl}/dashboard/admin/course-management/faculty`;

   // Fetch faculties on mount
   useEffect(() => {
      let isMounted = true;

      // Function to fetch faculties
      const fetchFaculties = async () => {
         setError(null); // Reset error state

         try {
            const { success, error } = await GetListOfFaculties();
            if (success) {
               const sortedData = success.data.sort((a, b) => b.id - a.id);
               if (isMounted) setFaculties(sortedData);
            } else if (error) {
               setError(error.message || "Failed to fetch faculties");
            }
         } catch (err) {
            setError("An unexpected error occurred: " + (err as Error).message);
         }
      };

      fetchFaculties();
      return () => { isMounted = false; }; // Cleanup on unmount
   }, []);

   const filteredData = useMemo(() =>
      filterData(faculties, "status", filter, ["faculty_name"], searchQuery),
      [filter, searchQuery, faculties]
   );

   return (
      <>
         <Card className="mt-7 p-10">
            <header className="w-full flex items-center justify-between text-site-a font-bold">
               <h5 className="text-2xl font-bold tracking-tight text-[#23628d] dark:text-white mb-7">
                  Faculty List
               </h5>
               {faculties && faculties.length > 0 && (
                  <ExportDropdown
                     data={faculties}
                     columns={
                        [
                           'faculty_name',
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
                           <SelectItem value="ALL">All Faculties</SelectItem>
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
                           Create New Faculty
                        </Button>
                     </Link>
                  </div>
               </div>
               <div className="grid grid-cols-1">
                  <DataTable columns={faculty_columns} data={filteredData} />
               </div>
            </div>
         </Card>
      </>
   )
}

export default Faculty