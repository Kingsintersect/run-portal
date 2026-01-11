"use client";

import React from 'react';
import { X } from 'lucide-react';

// Enhanced FourWayDrawer Context
const FourWayDrawerContext = React.createContext<{
    isFullPage?: boolean;
    direction?: 'bottom' | 'top' | 'left' | 'right';
}>({});

// Utility function for class names
const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};

interface FourWayDrawerRootProps {
    children: React.ReactNode;
    isFullPage?: boolean;
    direction?: 'bottom' | 'top' | 'left' | 'right';
}

function FourWayDrawer({ children, isFullPage = false, direction = 'bottom', ...props }: FourWayDrawerRootProps) {
    return (
        <FourWayDrawerContext.Provider value={{ isFullPage, direction }}>
            <div data-slot="drawer" {...props}>
                {children}
            </div>
        </FourWayDrawerContext.Provider>
    );
}

interface FourWayDrawerTriggerProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

function FourWayDrawerTrigger({ children, onClick, className, ...props }: FourWayDrawerTriggerProps) {
    return (
        <button
            type='button'
            data-slot="drawer-trigger"
            onClick={onClick}
            className={cn("outline-none", className)}
            {...props}
        >
            {children}
        </button>
    );
}

interface FourWayDrawerOverlayProps {
    className?: string;
    onClick?: () => void;
}

function FourWayDrawerOverlay({ className, onClick, ...props }: FourWayDrawerOverlayProps) {
    return (
        <div
            data-slot="drawer-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                className
            )}
            onClick={onClick}
            {...props}
        />
    );
}

interface FourWayDrawerContentProps {
    className?: string;
    children: React.ReactNode;
    isOpen?: boolean;
}

function FourWayDrawerContent({ className, children, isOpen = false, ...props }: FourWayDrawerContentProps) {
    const { isFullPage, direction } = React.useContext(FourWayDrawerContext);

    const getContentClasses = () => {
        const baseClasses = "group/drawer-content bg-white fixed z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out";

        if (isFullPage) {
            return cn(
                baseClasses,
                "inset-0 w-full h-full max-w-none max-h-none rounded-none border-none",
                isOpen ? "translate-x-0 translate-y-0" : "translate-y-full"
            );
        }

        switch (direction) {
            case 'bottom':
                return cn(
                    baseClasses,
                    "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t",
                    isOpen ? "translate-y-0" : "translate-y-full"
                );
            case 'top':
                return cn(
                    baseClasses,
                    "inset-x-0 top-0 mb-24 max-h-[80vh] rounded-b-lg border-b",
                    isOpen ? "translate-y-0" : "-translate-y-full"
                );
            case 'right':
                return cn(
                    baseClasses,
                    "inset-y-0 right-0 w-3/4 max-w-sm border-l",
                    isOpen ? "translate-x-0" : "translate-x-full"
                );
            case 'left':
                return cn(
                    baseClasses,
                    "inset-y-0 left-0 w-3/4 max-w-sm border-r",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                );
            default:
                return cn(
                    baseClasses,
                    "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t",
                    isOpen ? "translate-y-0" : "translate-y-full"
                );
        }
    };

    return (
        <div
            data-slot="drawer-content"
            className={cn(getContentClasses(), className)}
            {...props}
        >
            {!isFullPage && direction === 'bottom' && (
                <div className="mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full bg-gray-300" />
            )}
            {children}
        </div>
    );
}

interface FourWayDrawerHeaderProps {
    className?: string;
    children: React.ReactNode;
}

function FourWayDrawerHeader({ className, ...props }: FourWayDrawerHeaderProps) {
    const { isFullPage } = React.useContext(FourWayDrawerContext);

    return (
        <div
            data-slot="drawer-header"
            className={cn(
                "flex flex-col gap-2 p-6",
                isFullPage ? "bg-gradient-to-r from-blue-900 to-indigo-900 text-white" : "border-b",
                className
            )}
            {...props}
        />
    );
}

interface FourWayDrawerFooterProps {
    className?: string;
    children: React.ReactNode;
}

function FourWayDrawerFooter({ className, ...props }: FourWayDrawerFooterProps) {
    return (
        <div
            data-slot="drawer-footer"
            className={cn("mt-auto flex flex-col gap-2 p-6", className)}
            {...props}
        />
    );
}

interface FourWayDrawerTitleProps {
    className?: string;
    children: React.ReactNode;
}

function FourWayDrawerTitle({ className, ...props }: FourWayDrawerTitleProps) {
    const { isFullPage } = React.useContext(FourWayDrawerContext);

    return (
        <h2
            data-slot="drawer-title"
            className={cn(
                "font-semibold text-lg",
                isFullPage ? "text-white" : "text-gray-900",
                className
            )}
            {...props}
        />
    );
}

interface FourWayDrawerDescriptionProps {
    className?: string;
    children: React.ReactNode;
}

function FourWayDrawerDescription({ className, ...props }: FourWayDrawerDescriptionProps) {
    const { isFullPage } = React.useContext(FourWayDrawerContext);

    return (
        <p
            data-slot="drawer-description"
            className={cn(
                "text-sm",
                isFullPage ? "text-blue-100" : "text-gray-600",
                className
            )}
            {...props}
        />
    );
}

interface FourWayDrawerCloseProps {
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

function FourWayDrawerClose({ className, onClick, children, ...props }: FourWayDrawerCloseProps) {
    const { isFullPage } = React.useContext(FourWayDrawerContext);

    return (
        <button
            data-slot="drawer-close"
            onClick={onClick}
            className={cn(
                "absolute top-4 right-4 p-2 rounded-full transition-colors duration-200",
                isFullPage
                    ? "text-white hover:bg-white/10"
                    : "text-gray-500 hover:bg-gray-100",
                className
            )}
            {...props}
        >
            {children || <X className="h-5 w-5" />}
        </button>
    );
}


export {
    FourWayDrawer,
    FourWayDrawerTrigger,
    FourWayDrawerOverlay,
    FourWayDrawerContent,
    FourWayDrawerHeader,
    FourWayDrawerFooter,
    FourWayDrawerTitle,
    FourWayDrawerDescription,
    FourWayDrawerClose,
};
