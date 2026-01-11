"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, AlertCircle, GripVertical } from 'lucide-react';
import { useAdmissionStatus, useStudentApplicationStatus, useStudentPaymentStatus } from '@/contexts/StudentStatusContext';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Position {
    x: number;
    y: number;
}

interface DraggableTranscriptReminderProps {
    isVisible?: boolean;
    onClose?: () => void;
    onUploadClick?: () => void;
}

// Alert components (simplified for demo)
const Alert = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`rounded-lg border p-4 ${className}`}>
        {children}
    </div>
);

const AlertDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`text-sm ${className}`}>
        {children}
    </div>
);

export const DraggableTranscriptReminder: React.FC<DraggableTranscriptReminderProps> = ({
    isVisible = true,
    onClose,
    // onUploadClick,
}) => {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef<Position>({ x: 0, y: 0 });
    const { user } = useAuth();
    const studentName = user?.first_name + " " + user?.last_name

    const { isLoading, admissionStatus } = useAdmissionStatus();
    // const { isApplied, canUpdate } = useApplicationStatus();
    const { hasOutstandingPayments, unpaidFees } = useStudentPaymentStatus();
    const { missingDoc, hasUnuUploadedDocument } = useStudentApplicationStatus();

    // Initialize position after mount
    useEffect(() => {
        setMounted(true);

        const initializePosition = () => {
            const popupWidth = 320;
            const popupHeight = 250;

            // Position on the right side, vertically centered
            const initialX = window.innerWidth - popupWidth - 20; // 20px margin from right edge
            const initialY = Math.max(20, (window.innerHeight - popupHeight) / 2); // Vertically centered

            setPosition({
                x: initialX,
                y: initialY
            });
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initializePosition, 100);
        return () => clearTimeout(timer);
    }, []);

    // Handle window resize
    useEffect(() => {
        if (!mounted) return;

        const handleResize = () => {
            if (popupRef.current) {
                const rect = popupRef.current.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                setPosition(prev => ({
                    x: Math.max(0, Math.min(prev.x, maxX)),
                    y: Math.max(0, Math.min(prev.y, maxY))
                }));
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mounted]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!popupRef.current) return;

        setIsDragging(true);

        // Calculate the offset from the mouse position to the element's top-left corner
        const rect = popupRef.current.getBoundingClientRect();
        dragStartPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !popupRef.current) return;

        // Calculate new position based on mouse position minus the initial offset
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;

        // Get current dimensions for boundary checking
        const rect = popupRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    }, [isDragging]);

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [handleMouseMove, isDragging]);

    const handleClose = () => onClose?.();
    // const handleUpload = () => onUploadClick?.();
    const toggleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag event
        setIsMinimized(!isMinimized);
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag event
        handleClose();
    };

    if (!isVisible || !mounted) return null;
    if ((!hasOutstandingPayments && !hasUnuUploadedDocument) || isLoading || admissionStatus === "PENDING") return <></>;

    return (
        <div
            ref={popupRef}
            className={`fixed z-50 bg-white rounded-lg shadow-2xl border border-orange-200 transition-all duration-200 max-w-[95vw] ${isDragging ? 'cursor-grabbing' : 'cursor-default'
                } ${isMinimized ? 'w-80 h-16' : 'w-80'}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                willChange: isDragging ? 'transform' : 'auto'
            }}
        >
            {/* Header */}
            <div
                className={`flex items-center justify-between px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 opacity-70" />
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">Required Actions</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={toggleMinimize}
                        className="p-3 hover:bg-white/20 rounded transition-colors"
                        title={isMinimized ? "Expand" : "Minimize"}
                    >
                        <div className={`w-3 h-0.5 bg-white transition-transform ${isMinimized ? 'rotate-90' : ''}`} />
                    </button>
                    <button
                        onClick={handleCloseClick}
                        className="p-3 hover:bg-white/20 rounded transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {!isMinimized && (
                <div className="p-4">
                    <Alert className="border-orange-200 bg-orange-50">
                        <div className="flex">
                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                            <AlertDescription className="text-orange-800">
                                <div className="space-y-3">
                                    <p className="font-medium">
                                        Hello {studentName}! 👋
                                    </p>
                                    {hasUnuUploadedDocument &&
                                        <div className="text-xs text-orange-600 bg-orange-100 py-2 px-5 rounded">
                                            <h3 className='mb-2'> <strong>Required:</strong> Official Documents</h3>
                                            <ul id="missing-doc-list" className="list-disc space-y-1">
                                                {
                                                    missingDoc.map((value, i) => (
                                                        <li key={i} className="">
                                                            <Link href={`${value.url}`} className=''>
                                                                {value.label}
                                                            </Link>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    }
                                    {hasOutstandingPayments &&
                                        <div className="text-xs text-orange-600 bg-orange-100 py-2 px-5 rounded">
                                            <h3 className='mb-2'> <strong>Required:</strong> Payment Action</h3>
                                            <ul id="missing-doc-list" className="list-disc space-y-2 text-blue-600">
                                                {
                                                    unpaidFees.map((value, i) => (
                                                        <li key={i} className="">
                                                            <Link href={`${value.url}`} className=''>
                                                                {value.label}
                                                            </Link>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    }
                                </div>
                            </AlertDescription>
                        </div>
                    </Alert>

                    <div className="flex gap-2 mt-4">
                        {/* <button
                            onClick={handleUpload}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Now
                        </button> */}
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                        >
                            Remind Later
                        </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500 text-center">
                        Your Stuatuses
                    </div>
                </div>
            )}
        </div>
    );
};

// // REMOVE THE HOLDER COMPONENET