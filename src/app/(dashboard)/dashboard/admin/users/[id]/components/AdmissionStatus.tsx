import { Card } from '@/components/ui/card'
import React from 'react'
import InfoItem from './InfoItem'

const AdmissionStatus = ({ data }) => {
    return (
        <Card className="p-7">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                ADMISSION PROCESS STATUS
            </h5>
            <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-600">
                    <InfoItem label="Admission" value={(data.is_applied === 1) ? "Applied" : "Not Applied"} />
                    <InfoItem label="Application Fee" value={(data.application_payment_status === 1) ? "Paid" : "Not Paid"} />
                    <InfoItem label="Acceptance Fee" value={(data.acceptance_fee_payment_status === 1) ? "Paid" : "Not Paid"} />
                    <InfoItem label="Tuition Fee" value={(data.tuition_payment_status === 1) ? "Paid" : "Not Paid"} />
                </ul>
            </div>
        </Card>
    )
}

export default AdmissionStatus
