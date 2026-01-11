import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';

interface MenuItem {
  value: string | number;
  title: string;
}

interface SelectMenuProps extends React.HTMLAttributes<HTMLSelectElement> { 
    placeholder?: string;
    value?: string;
    onValueChange?: (value: any) => void;
    menu: MenuItem[];
}

type SelectMenuType = SelectMenuProps

const SelectMenu: React.FC<SelectMenuType> = ({
    className,
    placeholder = "Select Menu",
    menu,
    value,
    onValueChange
}) => {
    return (
        <Select
            value={value}
            onValueChange={ onValueChange}
        >
            <SelectTrigger className={cn("w-[180px]", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {menu && menu.map((item, index) => (
                    <SelectItem key={index} value={String(item.value)}>{item.title}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default SelectMenu