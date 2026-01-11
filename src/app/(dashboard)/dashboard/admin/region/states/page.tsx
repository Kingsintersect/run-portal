"use client";
import Search from '@/components/ui/inputs/Search'
import { baseUrl } from '@/config'
import { PlusIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { state_columns } from './state_table.columns'
import { DataTable } from '@/components/ui/datatable/DataTable'
import { GetListOfStates } from '@/app/actions/server.admin'
import ExportDropdown from '@/components/ExportDropdown';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { filterData } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { GenericDataType } from '@/types/generic.types';
export const dynamic = 'force-dynamic';

const StatesPage = () => {
   const [states, setStates] = useState<GenericDataType[]>([]);
   const [filter, setFilter] = useState("ALL");
   const [searchQuery, setSearchQuery] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const basePath = `${baseUrl}/dashboard/admin/region/states`;
   const { access_token } = useAuth();


   useEffect(() => {
      let isMounted = true;

      const fetchStates = async () => {
         setLoading(true);
         setError(null); // Reset error state

         try {
            const { success, error } = await GetListOfStates(access_token);
            if (success) {
               const sortedData = success.data.sort((a, b) => b.id - a.id);
               if (isMounted) setStates(sortedData);
            } else if (error) {
               setError(error.message || "Failed to fetch states");
            }
         } catch (error) {
            const errorMessage = typeof error === "string" ? error : (error as any).message || "Failed to fetch States";
            setError(errorMessage);
         } finally {
            setLoading(false);
         }
      };

      fetchStates().catch(console.error);
      return () => { isMounted = false; }; // Cleanup on unmount
   }, [access_token]);

   const filteredData = useMemo(() =>
      filterData(states, "status", filter, ["name"], searchQuery),
      [filter, searchQuery, states]
   );

   return (
      <>
         <Card className="mt-7 p-10">
            <header className="w-full flex items-center justify-between text-site-a font-bold">
               <h5 className="text-2xl font-bold tracking-tight text-[#23628d] dark:text-white mb-7">
                  State List
               </h5>
               {states && states.length > 0 && (
                  <ExportDropdown
                     data={states}
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
                           <SelectItem value="ALL">All States</SelectItem>
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
                           Create New State
                        </Button>
                     </Link>
                  </div>
               </div>
               <div className="grid grid-cols-1">
                  <DataTable columns={state_columns} data={filteredData} />
               </div>
            </div>
         </Card>
      </>
   )
}

export default StatesPage