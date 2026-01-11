import { ArrowRightIcon } from 'lucide-react'
import React from 'react'

const InfoItem = ({ label, value }) => {
    return (
        <li className="py-1 sm:py-1">
            <div className="flex items-center space-x-4">
                <div className="shrink-0">
                    <ArrowRightIcon width={20} color='green' />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                        <span className='inline-block mr-5 font-bold'>{label}</span>
                        {value}
                    </div>
                </div>
            </div>
        </li>
    )
}

export default InfoItem
