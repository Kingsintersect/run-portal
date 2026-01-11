"use client";

import React from 'react';
import { DollarSign, ClipboardCheck, Calendar } from "lucide-react";
import { useTuitionPayment } from '@/contexts/TuitionPaymentContext';
import { useAuth } from '@/contexts/AuthContext';

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { formatToCurrency } from '@/lib/utils';
import { FULL_TUITION_FEE } from '@/config';


const TuitionPaymentModal = () => {
	const {
		openModal,
		handleOpenModal,
		setPaymentType,
		amount,
		setAmount,
		processPayment,
		validationError,
		calculateOutstandingBalance,
		isProcessing
	} = useTuitionPayment();

	const { user } = useAuth();
	const hasPartialPayment = Number(user?.tuition_amount_paid || 0) > 0;
	const outstandingBalance = calculateOutstandingBalance(user?.tuition_amount_paid || 0);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value.replace(/,/g, ''));
		setAmount(isNaN(value) ? 0 : value);
	};

	return (
		<Dialog
			open={openModal}
			onOpenChange={() => handleOpenModal(false)}
		>
			<DialogContent className='w-full max-w-xl sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>
						{hasPartialPayment ? 'Pay Outstanding Balance' : 'Pay For Tuition'}
					</DialogTitle>
				</DialogHeader>

				{hasPartialPayment ? (
					<div className="p-6">
						<div className="text-center mb-6">
							<div className="text-4xl font-bold text-[#701401] mb-2">
								{formatToCurrency(outstandingBalance)}
							</div>
							<p className="text-gray-600">
								Complete your tuition payment to finalize your registration
							</p>
						</div>

						<div className="bg-blue-50 p-4 rounded-lg mb-6">
							<div className="flex items-start">
								<ClipboardCheck className="text-[#014670] mt-1 flex-shrink-0 h-5 w-5" />
								<div className="ml-3">
									<h4 className="text-[#014670] font-medium">Payment Details</h4>
									<div className="mt-2 space-y-1 text-sm">
										<p><span className="font-medium">Total Fee:</span> {formatToCurrency(FULL_TUITION_FEE / 2)}</p>
										<p><span className="font-medium">Amount Paid:</span> ₦{Number(user?.tuition_amount_paid || "").toLocaleString()}</p>
										<p><span className="font-medium">Outstanding:</span> {formatToCurrency(outstandingBalance)}</p>
									</div>
								</div>
							</div>
						</div>

						{validationError && (
							<div className="text-red-500 text-center mb-4">{validationError}</div>
						)}

						<div className="flex flex-col gap-4">
							<button
								onClick={processPayment}
								disabled={isProcessing}
								className="w-full py-3 bg-site-b-dark hover:bg-site-b text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
							>
								{isProcessing ? 'Processing...' : 'Complete Payment'}
							</button>

							<button
								onClick={() => handleOpenModal(false)}
								className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<>
						<Tabs
							defaultValue="full"
							className="w-full px-2"
							onValueChange={(val) => setPaymentType(val === "full" ? "full" : "installment")}
						>
							<TabsList className="w-full justify-center space-x-4 mb-6">
								<TabsTrigger value="full" className="flex items-center gap-2">
									<DollarSign className="h-5 w-5" /> Full Payment
								</TabsTrigger>
								<TabsTrigger value="installment" className="flex items-center gap-2">
									<Calendar className="h-5 w-5" /> Installment Payment
								</TabsTrigger>
							</TabsList>

							<TabsContent value="full">
								<div className="p-4">
									<div className="text-center mb-8">
										<div className="text-4xl font-bold text-site-b-dark mb-2">{formatToCurrency(FULL_TUITION_FEE)}</div>
										<p className="text-gray-600">
											Make a one-time payment for your full tuition fee
										</p>
									</div>

									<div className="bg-green-50 p-4 rounded-lg mb-6">
										<div className="flex items-start">
											<ClipboardCheck className="text-green-600 mt-1 flex-shrink-0 h-5 w-5" />
											<div className="ml-3">
												<h4 className="text-green-700 font-medium">Full Payment Benefits</h4>
												<ul className="mt-2 space-y-1 text-sm text-green-700">
													<li>• Complete your registration in one step</li>
													<li>• No need to track remaining payments</li>
													<li>• Immediate access to all student resources</li>
												</ul>
											</div>
										</div>
									</div>

									<div className="flex flex-col gap-4">
										<button
											onClick={processPayment}
											disabled={isProcessing}
											className="w-full py-3 bg-site-b-dark hover:bg-site-b text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
										>
											{isProcessing ? "Processing..." : `Pay ${formatToCurrency(FULL_TUITION_FEE)}`}
										</button>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="installment">
								<div className="p-4">
									<div className="text-center mb-6">
										<div className="text-2xl font-bold text-white bg-site-a-dark mb-2 py-2 animate-pulse">
											Minimum {formatToCurrency(FULL_TUITION_FEE / 2)} (50%)
										</div>
										<p className="text-site-b-dark">
											Pay in installments with a minimum of 50% initial payment
										</p>
									</div>

									<div className="bg-blue-50 p-4 rounded-lg mb-6">
										<div className="flex items-start">
											<ClipboardCheck className="text-[#014670] mt-1 flex-shrink-0 h-5 w-5" />
											<div className="ml-3">
												<h4 className="text-[#014670] font-medium">Installment Payment Guidelines</h4>
												<ul className="mt-2 space-y-1 text-sm text-[#014670]">
													<li>• Initial payment must be at least 50% (₦97,500)</li>
													<li>• Full payment must be completed within the semester</li>
													<li>• You can pay the remaining balance at any time</li>
												</ul>
											</div>
										</div>
									</div>

									<div className="mb-6">
										<label
											htmlFor="amount"
											className="block mb-2 text-sm font-medium text-gray-700"
										>
											Enter Amount (minimum {formatToCurrency(FULL_TUITION_FEE / 2)})
										</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
												<span className="text-gray-500">₦</span>
											</div>
											<input
												type="text"
												id="amount"
												className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-site-b focus:border-site-b block w-full pl-8 p-2.5"
												placeholder="Enter amount (minimum 97,500)"
												value={amount.toLocaleString()}
												onChange={handleAmountChange}
											/>
										</div>
										{validationError && (
											<p className="mt-2 text-sm text-red-600">{validationError}</p>
										)}
									</div>

									<div className="flex flex-col gap-4">
										<button
											onClick={processPayment}
											disabled={isProcessing}
											className="w-full py-3 bg-site-b-dark hover:bg-site-b text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
										>
											{isProcessing ? "Processing..." : "Continue to Payment"}
										</button>
									</div>
								</div>
							</TabsContent>
						</Tabs>

						<DialogFooter>
							<Button
								type="button"
								onClick={() => handleOpenModal(false)}
							>Cancel Process</Button>
						</DialogFooter>
					</>
				)}
			</DialogContent>
		</Dialog>

	);
};

export default TuitionPaymentModal;