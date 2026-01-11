import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import Spinner from './Spinner';
import { cn } from '@/lib/utils';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: ReactNode;
    to?: string;
    isLoading?: boolean;
    icon?: React.ReactElement;
}

const Button: FC<ButtonProps> = ({ to, children, className, isLoading, icon, variant, size, iconPosition, ...props }) => {
    const history: string[] = [];

    const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!props.disabled) {
            if (to) {
                history.push(to);
            } else {
                if (props.onClick) {
                    props.onClick(e);
                }
            }
        }
    };
    return (
        <button disabled={isLoading || props.disabled} className={cn(buttonVariants({ variant, size, iconPosition, className }))} {...props} >
            {children}
            {isLoading &&
                <IconContainer>
                    <Spinner fill='fill-green-500' />
                </IconContainer>
            }
            {!isLoading && icon}
        </button>
    )
}

const IconContainer = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return <div className="w-6 ml-4 relative">{children}</div>
}

export default Button

const buttonVariants = cva("flex items-center font-medium px-5 py-2.5 rounded-md gap-3 transition-all duration-500 ease-in-out last:mr-0", {
    variants: {
        variant: {

            primary: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ",

            secondary: "text-white bg-black focus:outline-none hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800",

            success: "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",

            danger: "focus:outline-none text-white bg-red-500 hover:bg-red-700 focus:ring-2 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-700",

            info: "focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-2 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900",

            warning: "focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-600",


            primaryOutline: "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800",

            secondaryOutline: "text-white bg-black focus:outline-none hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800",

            successOutline: "text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-2 focus:outline-none focus:ring-green-300 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800",

            dangerOutline: "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900",

            infoOutline: "text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-2 focus:outline-none focus:ring-purple-300 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900",

            warningOutline: "text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:outline-none focus:ring-yellow-300 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900",


            primaryGradiant: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 hover:bg-gradient-to-br",

            secondaryGradiant: "text-white bg-black focus:outline-none hover:bg-neutral-800 focus:ring-2 focus:ring-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-neutral-800 bg-gradient-to-r from-neutral-400 via-neutral-500 to-neutral-600 hover:bg-gradient-to-br",

            successGradiant: "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-2 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800  bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br",

            dangerGradiant: "focus:outline-none text-white bg-red-500 hover:bg-red-700 focus:ring-2 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-700  bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br",

            infoGradiant: "focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-2 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br",

            warningGradiant: "focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-600 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 hover:bg-gradient-to-br",

            primaryIconButton: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",

            primaryIconButtonOutline: "text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500",
        },
        size: {
            xs: "px-1 py-0.5 text-xs rounded-sm",
            sm: "px-2 py-1 text-sm rounded-sm",
            md: "px-3 py-2 text-base",
            lg: "px-4 py-2.5 text-xl",
            xl: "px-5 py-3.5 text-2xl",
            full: "text-xl px-4 py-1.5 flex items-center justify-center w-[100%]"
        },
        font: {
            bold: "font-bold",
            medium: "font-medium",
        },
        iconPosition: {
            left: "flex-row-reverse",
            right: "flex-row"
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
        font: "medium",
        iconPosition: "right",
    }
})


