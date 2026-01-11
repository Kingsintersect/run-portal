import { Progress } from "@/components/ui/progress";
import { Step } from "../lib/admission-form-hooks";

export const ProgressIndicator: React.FC<{ currentStep: number; steps: Step[] }> = ({ currentStep, steps }) => {
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${index <= currentStep
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-400'
                                }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
            <Progress value={progress} className="h-2" />
        </div>
    );
};
