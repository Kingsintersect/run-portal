"use client";

import Search from '@/components/ui/inputs/Search'
import { Card } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useState, useEffect, useMemo } from 'react';
import ExportDropdown from '@/components/ExportDropdown';
import { FetchAllTeachers } from '@/app/actions/portal.actions';
import { DataTable } from '@/components/ui/datatable/DataTable';
import { filterData } from '@/lib/utils';
import { tutors_columns } from './tutors_table.columns';
import { useAuth } from '@/contexts/AuthContext';
import { ObjectType } from '@/types/generic.types';

const TutorsEnrollmentPage = () => {
	const { access_token } = useAuth();
	const [userData, setUserData] = useState<ObjectType[]>([]);
	const [filter, setFilter] = useState("ALL");
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const getAlluser = async () => {
			if (access_token) {
				const { success, error } = await FetchAllTeachers(access_token)
				if (success) {
					const descendingData = [...success.data].sort((a, b) => b.id - a.id);
					setUserData(descendingData);
					return
				}
				if (error) {
					console.error('Error Fetching tutors Data: ', error.message);
				}
			}
		}
		getAlluser();
	}, [access_token])

	const filteredusers = useMemo(() =>
		filterData(userData, "role", filter, ["first_name", "last_name"], searchQuery),
		[filter, searchQuery, userData]
	);

	return (
		<>
			<Card className="mt-7 p-10">
				<header className="w-full flex items-center justify-between text-site-a font-bold">
					<h5 className="text-2xl font-bold tracking-tight text-[#23628d] dark:text-white mb-7">
						All Tutors
					</h5>
					{userData && userData.length > 0 && (
						<ExportDropdown
							data={userData}
							columns={
								[
									'first_name',
									'last_name',
									'email',
									'program',
									'department',
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
								placeholder='Search by name or registration number...'
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
									<SelectValue placeholder="Select Filter Key" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">All Tutors</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid grid-cols-1">
						<DataTable columns={tutors_columns} data={filteredusers} />
					</div>
				</div>
			</Card>
		</>
	)
}

export default TutorsEnrollmentPage