"use client";

interface Step {
    id: number;
    label: string;
}
interface StepperProps {
    steps: Step[];
    currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="flex w-full border border-gray-300 rounded-md p-4 text-start">
            {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center w-full mr-5 last:mr-0">
                    {/* Step Connector Line */}
                    {index >= 0 && (
                        <div
                            className={`h-1 w-full mb-3 bg-[#23628d] ${currentStep == step.id ? "bg-[#23628d]" : "bg-gray-300"
                                }`}
                        />
                    )}

                    {/* Step Text */}
                    <div className="flex flex-col w-full">
                        <span
                            className={`text-base font-bold ${currentStep === step.id
                                ? "text-site-b-dark"
                                : currentStep > step.id
                                    ? "text-site-b-dark"
                                    : "text-gray-400"
                                }`}
                            aria-current={currentStep === step.id ? "step" : undefined}
                        >
                            {step.label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
