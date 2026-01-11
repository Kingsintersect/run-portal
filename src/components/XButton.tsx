import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import React from 'react'

export const XButton = ({ onClick, title = "delete", className }: { onClick: () => void, title?: string, className?: string }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn("absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200", className)}
            title={title}
        >
            <X className="w-3 h-3" />
        </button>
    )
}
