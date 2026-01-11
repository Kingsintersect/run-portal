import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { GenericDataType } from '@/types/generic.types';

interface DropMenuItem {
    title: string;
    condition?: "ACTIVE" | "INACTIVE";
    url?: string;
    checked?: boolean;
    onClick?: () => void;
}
interface DropDownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    menuLabel: string;
    menu: DropMenuItem[];
    variant: "DEFUALT" | "CHECKBOX" | "RADIO";
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
    title,
    menuLabel,
    menu,
    variant = "DEFUALT",
}) => {
    const [selectedValue, setSelectedValue] = React.useState(menu[0]?.title || "");

    // Local state for managing checked items
    const [processedMenu, setProcessedMenu] = useState(
        menu.map((item) => ({
            ...item,
            condition: item.condition ?? "ACTIVE",
            checked: item.checked ?? false,
        }))
    );

    // Handle checking event
    const handleCheckedChange = (index: number, checked: boolean) => {
        setProcessedMenu((prevMenu: GenericDataType[]) =>
            prevMenu.map((item: any, i: number) =>
                i === index ? { ...item, checked } : item
            )
        );
        // Execute the item's onClick method if provided
        if (processedMenu[index].onClick) {
            processedMenu[index].onClick!();
        }
    };
    // Handle radio selection
    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
        const selectedItem = processedMenu.find((item) => item.title === value);

        if (selectedItem?.onClick) {
            selectedItem.onClick();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{title}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(variant === "DEFUALT") && processedMenu && processedMenu.map((item, index) => (
                    <Link href={item.url ?? "#"} key={index}>
                        <DropdownMenuItem
                            key={index}
                            disabled={item.condition !== "ACTIVE"}
                        >
                            {item.title}
                        </DropdownMenuItem>
                    </Link>
                ))}
                {(variant === "CHECKBOX") && processedMenu && processedMenu.map((item, index) => (
                    <Link href={item.url ?? "#"} key={index}>
                        <DropdownMenuCheckboxItem
                            key={index}
                            checked={item.checked}
                            onCheckedChange={(checked) => handleCheckedChange(index, checked)}
                            disabled={item.condition !== "ACTIVE"}
                        >
                            {item.title}
                        </DropdownMenuCheckboxItem>
                    </Link>
                ))}
                {variant === "RADIO" && (
                    <DropdownMenuRadioGroup
                        value={selectedValue}
                        onValueChange={handleRadioChange}
                    >
                        {processedMenu.map((item, index) => (
                            <Link href={item.url ?? "#"} key={index}>
                                <DropdownMenuRadioItem key={index} value={item.title}>
                                    {item.title}
                                </DropdownMenuRadioItem>
                            </Link>
                        ))}
                    </DropdownMenuRadioGroup>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDownMenu
