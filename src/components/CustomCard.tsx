import React, { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils'

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
    titleClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
}

type CustomCardType = CustomCardProps
const CustomCard: React.FC<CustomCardType> = ({
    className,
    titleClassName,
    contentClassName,
    footerClassName,
    title,
    description,
    children,
    footer,
    ...props
}) => {
    return (
        <Card className={cn("p-10", className)} {...props}>
            {title&&
                <CardHeader>
                    <CardTitle  className={cn("", titleClassName)}>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            }
            
            <CardContent  className={cn("p-0", contentClassName)}>
                {children}
            </CardContent>
            {footer &&
                <CardFooter className={cn("", footerClassName)}>
                    {footer}
                </CardFooter>
            }
        </Card>

    )
}

export default CustomCard
