import { TrendingUp } from 'lucide-react'
import React from 'react'

export const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: color }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <TrendingUp size={16} className="text-green-500 mr-1" />
                            <span className="text-sm text-green-500">{trend}</span>
                        </div>
                    )}
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
                    <Icon size={24} style={{ color }} />
                </div>
            </div>
        </div>
    )
}
