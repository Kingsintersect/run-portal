import { Button } from '@/components/ui/button'
import { ArrowRight, NotebookPen, Gauge } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const DashboardCard = ({ user }) => {
    const canUpdateApplicationForm = user?.admission_status !== "ADMITTED" && user?.admission_status !== "NOT_ADMITTED";

    return (
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Gauge className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Proceed to dashboard</h3>
                <p className="text-gray-600">Your payment was successful. You can now access and fill your application form.</p>
            </div>

            {/* Call to Action */}
            <div className={`bg-gradient-to-r from-purple-100 to-yellow-100 rounded-lg p-6 flex items-center ${canUpdateApplicationForm ? "justify-between" : "justify-center"}`}>
                {canUpdateApplicationForm && <Button
                    className="bg-white text-yellow-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg inline-flex items-center shadow-lg"
                    asChild
                >
                    <Link href={`/dashboard/update-application-form?id=${user?.id}`} className="flex items-center">
                        <NotebookPen className="h-5 w-5 mr-3" />
                        Update application info
                        <ArrowRight className="h-5 w-5 ml-3" />
                    </Link>
                </Button>}
                <Button
                    className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg inline-flex items-center shadow-lg"
                    asChild
                >
                    <Link href={`/dashboard/student`} className="flex items-center">
                        <NotebookPen className="h-5 w-5 mr-3" />
                        Proceed to Dashboard
                        <ArrowRight className="h-5 w-5 ml-3" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
