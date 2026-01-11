"use client";
import Search from '@/components/ui/inputs/Search'
import { baseUrl } from '@/config'
import { PlusIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import React, { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/ui/datatable/DataTable'
import { lga_columns } from './lga_table.columns'
import { GetListOfLocalGov } from '@/app/actions/server.admin'
import { Card } from '@/components/ui/card';
import ExportDropdown from '@/components/ExportDropdown';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { filterData } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { GenericDataType } from '@/types/generic.types';

export const dynamic = "force-dynamic";

const LocalGovAreaPage = () => {
   const [localGovAreas, setLocalGovAreas] = useState<GenericDataType[]>([]);
   const [filter, setFilter] = useState("ALL");
   const [searchQuery, setSearchQuery] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const basePath: string = `${baseUrl}/dashboard/admin/region/local-gov`;
   const { access_token } = useAuth();

   useEffect(() => {
      let isMounted = true;

      const fetchLocalGovArea = async () => {
         setLoading(true);
         setError(null); // Reset error state

         try {
            const { success, error } = await GetListOfLocalGov(access_token ?? "");
            if (success) {
               const sortedData = success.data.sort((a, b) => b.id - a.id);
               if (isMounted) setLocalGovAreas(sortedData);
            } else if (error) {
               setError(error.message || "Failed to fetch faculties");
            }
         } catch (error) {
            const errorMessage = typeof error === "string" ? error : (error as any).message || "Failed to fetch countries";
            setError(errorMessage);
         } finally {
            setLoading(false);
         }
      };

      fetchLocalGovArea().catch(console.error);
      return () => { isMounted = false; }; // Cleanup on unmount
   }, [access_token]);

   const filteredData = useMemo(() =>
      filterData(localGovAreas, "status", filter, ["name"], searchQuery),
      [filter, searchQuery, localGovAreas]
   );

   return (
      <>
         <Card className="mt-7 p-10">
            <header className="w-full flex items-center justify-between text-site-a font-bold">
               <h5 className="text-2xl font-bold tracking-tight text-[#23628d] dark:text-white mb-7">
                  Local Governmnet Area List
               </h5>
               {localGovAreas && localGovAreas.length > 0 && (
                  <ExportDropdown
                     data={localGovAreas}
                     columns={
                        [
                           'name',
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
                           <SelectItem value="ALL">All LGA</SelectItem>
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
                           Create New LGA
                        </Button>
                     </Link>
                  </div>
               </div>
               <div className="grid grid-cols-1">
                  <DataTable columns={lga_columns} data={filteredData} />
               </div>
            </div>
         </Card>
      </>
   )
}

export default LocalGovAreaPage