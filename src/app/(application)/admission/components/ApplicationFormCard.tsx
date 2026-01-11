import { Button } from '@/components/ui/button'
import { ArrowRight, NotebookPen, BookOpenCheck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const ApplicationFormCard = () => {

    return (
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <BookOpenCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Launch your application form</h3>
                <p className="text-gray-600">Your payment was successful. You can now access and fill your application form.</p>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-center">
                <h4 className="text-xl font-semibold text-white mb-2">Start Your Application Process</h4>
                <p className="text-green-100 mb-6">Please complete your application with accurate information and ensure you upload all the required documents..</p>

                <Button
                    // onClick={navigateToForm}
                    className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg inline-flex items-center shadow-lg"
                    asChild
                >
                    <Link href={`/admission/form`} className="flex items-center">
                        <NotebookPen className="h-5 w-5 mr-3" />
                        Proceed to form
                        <ArrowRight className="h-5 w-5 ml-3" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
