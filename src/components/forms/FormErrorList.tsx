import React from 'react'
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

export const FormErrorList = ({ allErrors }) => {
    if (!allErrors || allErrors.length === 0) {
        return null; // Don't render anything if no errors
    }

    return (
        <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            <ul>
                {allErrors.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                ))}
            </ul>
        </div>
    )
}


export const StepErrorDisplay = ({ stepErrors, currentStep }) => {
    return (
        <>
            {
                stepErrors[currentStep] && stepErrors[currentStep].length > 0 && stepErrors[currentStep].map((error, index) => (
                    <Alert key={index} className="mt-2 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                            {error}
                        </AlertDescription>
                    </Alert>
                ))
            }
        </>
    )
}
