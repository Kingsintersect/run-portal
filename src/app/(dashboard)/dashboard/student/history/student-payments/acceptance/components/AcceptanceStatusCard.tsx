"use client";

import React from 'react';
import Image from 'next/image';
import { CheckCircle, CreditCard } from "lucide-react";
import { motion } from 'framer-motion';
import { useAcceptancePayment } from '@/contexts/AcceptancePaymentContext';
import { HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { baseUrl } from '@/config';
import { formatToCurrency } from '@/lib/utils';
import { ACCEPTANCE_FEE } from "@/config"
import { UserInterface } from '@/config/Types';

// Primary color: #701401 (deep burgundy)
// Complementary colors: #014670 (deep blue), #407010 (olive green)

const AcceptanceStatusCard = ({ student }: { student: UserInterface }) => {
	const { handleOpenModal, hasAppliedForAdmission, hasBeenAdmitted } = useAcceptancePayment();
	const isPaid = student?.acceptance_fee_payment_status === "FULLY_PAID";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="w-full rounded-xl overflow-hidden shadow-lg"
		>
			{/* Header section with gradient background */}
			<div className={`px-6 py-4 ${isPaid ? 'bg-gradient-to-r from-green-700 to-green-500' : 'bg-gradient-to-r from-site-b-dark to-site-b'}`}>
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold text-white">
						{isPaid ? 'Acceptance Fee Paid' : 'Acceptance Fee'}
					</h2>
					{isPaid ? (
						<CheckCircle className="h-10 w-10 text-white" />
					) : (
						<CreditCard className="h-10 w-10 text-white" />
					)}
				</div>

				{!isPaid && (
					<div className="mt-2">
						<p className="text-white text-sm">Amount:</p>
						<p className="text-white text-3xl font-bold">
							{formatToCurrency(ACCEPTANCE_FEE)}
						</p>
					</div>
				)}
			</div>

			{/* Body section */}
			<div className="bg-white p-6">
				{/* Image section */}
				<div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
					<Image
						src={isPaid ? '/payments/payment2.jpg' : '/payments/payment3.jpg'}
						alt={'Acceptance payment image'}
						fill
						style={{ objectFit: "cover" }}
						className="transition-transform hover:scale-105 duration-300"
					/>
					{!hasAppliedForAdmission &&
						(
							<div className='absolute z-20 inset-0 w-full h-full flex items-center justify-center'>
								<div className="py-7 px-4 bg-red-50 dark:bg-red-800/50 rounded-xl text-center">
									<div className="inline-flex justify-center items-center w-16 h-16 bg-red-100 dark:bg-red-700 rounded-full mb-2">
										<HandCoins className="h-8 w-8 text-red-500 dark:text-red-400" />
									</div>
									<h3 className="text-xl font-medium text-red-700 dark:text-red-300 mb-2">Application Yet To Be completed...</h3>
									<Button variant={"destructive"} asChild className='animate-bounce'>
										<Link href={`${baseUrl}/admission/form`} className='text-white'>
											COMPLETE YOUR APPLICATION
										</Link>
									</Button>
								</div>
							</div>
						)
					}
					{!hasBeenAdmitted &&
						(
							<div className='absolute z-20 inset-0 w-full h-full flex items-center justify-center'>
								<div className="py-7 px-4 bg-cyan-50 dark:bg-cyan-800/50 rounded-xl text-center">
									<div className="inline-flex justify-center items-center w-16 h-16 bg-cyan-100 dark:bg-cyan-700 rounded-full mb-2">
										<HandCoins className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
									</div>
									<h3 className="text-xl font-medium text-cyan-700 dark:text-cyan-300 mb-5">You have not been admitted...</h3>
									<Button variant={"default"} asChild className='animate-bounce'>
										<Link href={`${baseUrl}/dashboard/student`} className='text-white'>
											RETURN TO DASHBOARD
										</Link>
									</Button>
								</div>
							</div>
						)
					}
				</div>

				{/* Message */}
				<p className="text-[#014670] text-lg mb-6 text-center">
					{isPaid
						? 'Your Acceptance fee has been successfully paid. Thank you!'
						: 'Please pay your tuition fee to continue with your registration process.'}
				</p>

				{/* Button section - only show if not fully paid */}
				{!isPaid && (
					<div className="flex justify-center">
						<button
							onClick={() => handleOpenModal(true)}
							className="px-6 py-3 bg-site-b-dark hover:bg-site-b text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-site-b-dark focus:ring-opacity-50"
						>
							{'Pay Acceptance Fee'}
						</button>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default AcceptanceStatusCard;