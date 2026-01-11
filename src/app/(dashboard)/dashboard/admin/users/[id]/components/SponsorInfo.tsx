import { Card } from '@/components/ui/card'
import React from 'react'
import InfoItem from './InfoItem'

const SponsorInfo = ({ application }) => {
    return (
        <Card className="p-7">
            <div className="mb-4 flex items-center justify-between">
                <h5 className="text-2xl font-bold leading-none text-gray-900 dark:text-white">Sponsor</h5>
            </div>
            <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-600">
                    <InfoItem label="Sponsor Name" value={application.sponsor_name} />
                    <InfoItem label="Relationship" value={application.sponsor_relationship} />
                    <InfoItem label="Sponsors Phone Number" value={application.sponsor_phone_number} />
                    <InfoItem label="Sponsors Email" value={application.sponsor_email} />
                    <InfoItem label="Sponsors Contact Address" value={application.sponsor_contact_address} />
                </ul>
            </div>
        </Card>
    )
}

export default SponsorInfo
