import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { baseUrl } from '@/config';
import { Copy, Edit, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const ActionMenu = ({ studentId, onCopy }: { studentId: string, onCopy?: (id: string) => void; }) => {
    return (
        <div className="text-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Copy Id */}
                    <DropdownMenuItem onClick={() => onCopy?.(studentId)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                    </DropdownMenuItem>

                    {/* Edit Student */}
                    <DropdownMenuItem asChild>
                        {/* <Link href={`/dashboard/student/${studentId}/edit`}> */}
                        <Link href={`${baseUrl}/dashboard/update-application-form?id=${studentId}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>View Application</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
