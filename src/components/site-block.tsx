import React from 'react'

interface SiteBlockProps {
    children: React.ReactNode;
}

export const SiteBlock = ({ children }: SiteBlockProps) => {
    return (
        <div className="bg-gradient-to-r from-site-b-dark to-site-a-dark rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
                {children}
            </div>
        </div>
    )
}
