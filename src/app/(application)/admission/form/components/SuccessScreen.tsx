import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export const SuccessScreen: React.FC<{ onReset: () => void }> = ({ onReset }) => (

    // here set the isApplied value to 1 in the uuse global state
    // and redirect to the dashboard

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-site-a-dark mb-2">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">
                    Thank you for your application. We'll review it and get back to you soonest.
                </p>
                <Button onClick={onReset} className="w-full" asChild>
                    <Link href="/admission">
                        Continue to overview
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </div>
);