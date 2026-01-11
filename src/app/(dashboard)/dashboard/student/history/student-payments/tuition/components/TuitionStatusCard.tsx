"use client";

import React from 'react';
import Image from 'next/image';
import { CheckCircle, CreditCard } from "lucide-react";
import { motion } from 'framer-motion';
import { useTuitionPayment } from '@/contexts/TuitionPaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { baseUrl } from '@/config';
import { UserInterface } from '@/config/Types';

// Primary color: #701401 (deep burgundy)
// Complementary colors: #014670 (deep blue), #407010 (olive green)

const TuitionStatusCard = ({ student }: { student: UserInterface }) => {
	const { user } = useAuth();
	const { handleOpenModal, hasPiadAcceptanceFee, calculateOutstandingBalance } = useTuitionPayment();
	const isPaid = student?.tuition_payment_status === "FULLY_PAID";
	const hasPartialPayment = student?.tuition_payment_status === "PART_PAID";
	const outstandingBalance = calculateOutstandingBalance(student?.tuition_amount_paid || 0);

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
						{isPaid ? 'Tuition Fee Paid' : hasPartialPayment ? 'Outstanding Tuition Fee' : 'Tuition Fee'}
					</h2>
					{isPaid ? (
						<CheckCircle className="h-10 w-10 text-white" />
					) : (
						<div className="flex flex-col items-end justify-end text-yellow-200">
							{(user?.tuition_amount_paid) && (<p><span className="font-medium">Amount Paid:</span> ₦{Number(user?.tuition_amount_paid || 0).toLocaleString()}</p>)}

							<CreditCard className="h-10 w-10 text-white" />
						</div>
					)}
				</div>

				{!isPaid && (
					<div className="mt-2">
						<p className="text-white text-sm">Amount:</p>
						<p className="text-white text-3xl font-bold">
							₦{hasPartialPayment ? outstandingBalance.toLocaleString() : '195,000'}
						</p>
					</div>
				)}
			</div>

			{/* Body section */}
			<div className="bg-white p-6">
				{/* Image section */}
				<div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
					<Image
						src={isPaid ? '/payments/payment1.jpg' : '/payments/payment7.jpg'}
						alt={'Tuition payment image'}
						fill
						style={{ objectFit: "cover" }}
						className="transition-transform hover:scale-105 duration-300"
					/>
					{!hasPiadAcceptanceFee &&
						(
							<div className='absolute z-20 inset-0 w-full h-full flex items-center justify-center'>
								<div className="py-7 px-4 bg-red-50 dark:bg-red-800/50 rounded-xl text-center">
									<div className="inline-flex justify-center items-center w-16 h-16 bg-red-100 dark:bg-red-700 rounded-full mb-2">
										<HandCoins className="h-8 w-8 text-red-500 dark:text-red-400" />
									</div>
									<h3 className="text-xl font-medium text-red-700 dark:text-red-300 mb-2">Acceptance Yet To Be Paid...</h3>
									<Button variant={"destructive"} asChild className='animate-bounce'>
										<Link href={`${baseUrl}/dashboard/student/history/student-payments/acceptance`} className='text-white'>
											PAY ACCEPTANCE
										</Link>
									</Button>
								</div>
							</div>
						)
					}
				</div>

				{/* Message */}
				<p className="text-site-b-dark text-lg mb-6 text-center">
					{isPaid
						? 'Your tuition fee has been successfully paid. Thank you!'
						: hasPartialPayment
							? 'Complete your tuition payment to obtain you REG-NUMBER.'
							: 'Please pay your tuition fee to continue with your registration process.'}
				</p>

				{/* Button section - only show if not fully paid */}
				{!isPaid && (
					<div className="flex justify-center">
						<button
							onClick={() => handleOpenModal(true)}
							className="px-6 py-3 bg-site-b-dark hover:bg-site-b text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-site-b-dark focus:ring-opacity-50"
						>
							{hasPartialPayment ? 'Pay Outstanding Balance' : 'Pay Tuition Fee'}
						</button>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default TuitionStatusCard;