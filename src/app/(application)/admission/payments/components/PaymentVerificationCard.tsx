"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface PaymentVerificationCardProps {
    paymentRef: string;
    isVerifying: boolean;
    verificationResult: {
        status: string;
        message: string;
        amount?: number;
        paymentDate?: string;
    } | null;
    onVerify: () => void;
    onProceed: () => void;
    autoVerify?: boolean;
}

export const PaymentVerificationCard: React.FC<PaymentVerificationCardProps> = ({
    paymentRef,
    isVerifying,
    verificationResult,
    onVerify,
    onProceed,
    autoVerify = false
}) => {

    const hasVerifiedRef = useRef(false);

    useEffect(() => {
        if (paymentRef && autoVerify && !hasVerifiedRef.current) {
            if (autoVerify !== true) return;
            onVerify();
            hasVerifiedRef.current = true;
        }
    }, [paymentRef, autoVerify, onVerify]);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle>Payment Verification</CardTitle>
                <CardDescription>
                    Verifying your payment to complete the process
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Payment Reference</p>
                    <p className="font-mono text-lg font-semibold bg-gray-100 p-2 rounded">
                        {paymentRef}
                    </p>
                </div>

                {(!verificationResult && autoVerify) && <div className="w-full flex items-center justify-center">
                    {isVerifying && (
                        <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Verifying Payment...
                        </>
                    )}
                </div>}

                {(!verificationResult && !autoVerify) && (
                    <div className="text-center">
                        <Button
                            onClick={onVerify}
                            disabled={isVerifying}
                            className="w-full"
                        >
                            {isVerifying ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Verifying Payment...
                                </>
                            ) : (
                                'Verify Payment'
                            )}
                        </Button>
                    </div>
                )}

                {verificationResult && (
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            {verificationResult.status ? (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : (
                                <XCircle className="h-6 w-6 text-red-500" />
                            )}
                            <span className={`font-medium ${verificationResult.status ? 'text-green-700' : 'text-red-700'
                                }`}>
                                {verificationResult.message}
                            </span>
                        </div>

                        {verificationResult.status && verificationResult.amount && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-800">
                                    Amount: ₦{verificationResult.amount.toLocaleString()}
                                </p>
                                {verificationResult.paymentDate && (
                                    <p className="text-sm text-green-800">
                                        Date: {new Date(verificationResult.paymentDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        )}

                        {verificationResult.status && (
                            <Button onClick={onProceed} className="w-full">
                                continue
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
