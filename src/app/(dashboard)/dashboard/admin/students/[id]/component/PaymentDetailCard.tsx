import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"
import { Edit } from "lucide-react";
import { statusColors } from "../update.types";

export function PaymentDetailCard({ title, paymentData, onAddPayment }) {
    const percentage = paymentData.total > 0
        ? Math.round((paymentData.paid / paymentData.total) * 100)
        : 0;

    return (
        <Card className="border-cyan-100 shadow-sm mb-6">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-orange-50 pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-lg text-cyan-800">{title} Details</CardTitle>
                        <CardDescription className="text-orange-600">
                            Payment progress and transaction history
                        </CardDescription>
                    </div>
                    <Badge className={statusColors[paymentData.status]}>
                        {paymentData.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">
                            <span className="font-medium text-cyan-700">₦{paymentData.paid.toLocaleString()}</span> of ₦{paymentData.total.toLocaleString()} paid
                        </div>
                        <div className="text-sm font-medium">{percentage}%</div>
                    </div>
                    <Progress value={percentage} className="h-2 bg-cyan-100" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-cyan-700">Transaction History</span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 border-orange-200 text-orange-600 hover:bg-orange-50"
                            onClick={onAddPayment}
                        >
                            Add Payment
                        </Button>
                    </div>

                    {paymentData.transactions.length > 0 ? (
                        <div className="border rounded-md divide-y divide-cyan-100">
                            {paymentData.transactions.map(transaction => (
                                <div key={transaction.id} className="p-3 hover:bg-orange-50 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-cyan-800">₦{transaction.amount.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">Ref: {transaction.reference}</div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-sm text-gray-500">
                            No transaction records found.
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-gray-50 border-t border-cyan-100">
                <Button variant="ghost" size="sm" className="text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Details
                </Button>
            </CardFooter>
        </Card>
    );
}