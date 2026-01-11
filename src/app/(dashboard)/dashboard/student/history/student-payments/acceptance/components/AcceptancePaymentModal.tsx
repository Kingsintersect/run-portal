"use client";

import React from 'react';
import { HashIcon, ClipboardCheck } from "lucide-react";
import { useAcceptancePayment } from '@/contexts/AcceptancePaymentContext';

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

const AcceptancePaymentModal = () => {
	const {
		openModal,
		handleOpenModal,
		amount,
		processPayment,
		isProcessing
	} = useAcceptancePayment();

	return (
		<Dialog
			open={openModal}
			onOpenChange={() => handleOpenModal(false)}
		>
			<DialogContent className='w-full max-w-xl sm:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>
						{'Pay For Acceptance'}
					</DialogTitle>
				</DialogHeader>

				<Tabs
					defaultValue="full"
					className="w-full px-2"
				>
					<TabsList className="w-full justify-center space-x-4 mb-6">
						<TabsTrigger value="full" className="flex items-center gap-2">
							<HashIcon width={20} height={20} /> Full Payment
						</TabsTrigger>
					</TabsList>

					<TabsContent value="full">
						<div className="p-4">
							<div className="text-center mb-8">
								<div className="text-4xl font-bold text-[#701401] mb-2">{formatToCurrency(amount)}</div>
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
											<li>• Take your registration further to the next step</li>
											<li>• No need to track remaining payments</li>
											<li>• You can proceed to paying your tuition fee</li>
										</ul>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								<button
									onClick={processPayment}
									disabled={isProcessing}
									className="w-full py-3 bg-[#701401] hover:bg-[#8A1A01] text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
								>
									{isProcessing ? "Processing..." : `Pay ${formatToCurrency(amount)}`}
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
			</DialogContent>
		</Dialog>

	);
};

export default AcceptancePaymentModal;