import React from 'react';
import { DetachedProgramAccordionDisplay, ProgramNode } from './DetachedProgramAccordionDisplay';
import { ProgramRequirementsLink } from '@/components/requirements/ProgramRequirementsModal';

// Reusable Input Component
export const EditableField: React.FC<{
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'tel' | 'date' | "number";
    placeholder?: string;
    isEditing: boolean;
    className?: string;
}> = ({ label, value, onChange, type = 'text', placeholder, isEditing, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {isEditing ? (
            <input
                type={type}
                value={value ?? undefined}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
        ) : (
            <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                {value || <span className="text-gray-400 italic">Not provided</span>}
            </p>
        )}
    </div>
);

// Textarea Component for longer content
export const EditableTextArea: React.FC<{
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    isEditing: boolean;
    className?: string;
    rows?: number;
}> = ({ label, value, onChange, placeholder, isEditing, className, rows = 3 }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {isEditing ? (
            <textarea
                value={value ?? undefined}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm resize-vertical"
            />
        ) : (
            <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                {value || <span className="text-gray-400 italic">Not provided</span>}
            </p>
        )}
    </div>
);



// Radio Button Component
export const EditableRadioGroup: React.FC<{
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    isEditing: boolean;
    className?: string;
}> = ({ label, value, onChange, options, isEditing, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        {isEditing ? (
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center">
                        <input
                            type="radio"
                            name={label.replace(/\s+/g, '_').toLowerCase()}
                            value={option.value ?? undefined}
                            checked={value === option.value}
                            onChange={(e) => onChange(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-900">{option.label}</span>
                    </label>
                ))}
            </div>
        ) : (
            <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                {options.find(opt => opt.value === value)?.label ||
                    <span className="text-gray-400 italic">Not selected</span>}
            </p>
        )}
    </div>
);

// Checkbox Component
export const EditableCheckbox: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    isEditing: boolean;
    className?: string;
    description?: string;
}> = ({ label, checked, onChange, isEditing, className, description }) => (
    <div className={className}>
        {isEditing ? (
            <label className="flex items-start">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>
            </label>
        ) : (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${checked
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {checked ? 'Yes' : 'No'}
                    </span>
                </p>
            </div>
        )}
    </div>
);

// Select Menu Component
export const EditableSelect: React.FC<{
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    isEditing: boolean;
    className?: string;
}> = ({ label, value, onChange, options, placeholder = "Select an option", isEditing, className }) => {
    // Normalize the value for comparison
    const normalizedValue = value?.toLowerCase();
    const selectedOption = options.find(opt => opt.value.toLowerCase() === normalizedValue);

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {isEditing ? (
                <select
                    value={selectedOption?.value ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm bg-white"
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                    {selectedOption?.label || <span className="text-gray-400 italic">Not selected</span>}
                </p>
            )}
        </div>
    );
}

// Updated EditableProgramOptions component
interface EditableProgramOptionsProps {
    label: string;
    value: string | null;
    onChange: (value: string) => void;
    onIdChange?: (id: string) => void; // Optional callback for program ID
    placeholder?: string;
    isEditing: boolean;
    className?: string;
    programs?: ProgramNode[];
    isLoading?: boolean;
    isError?: boolean;
    showRequirementLink?: boolean;
}

export const EditableProgramOptions: React.FC<EditableProgramOptionsProps> = ({
    label,
    value,
    onChange,
    onIdChange,
    // placeholder = "Select program options",
    isEditing,
    className,
    programs,
    isLoading,
    isError,
    showRequirementLink = true,
}) => {
    const handleProgramSelect = (program: { id: number; name: string }) => {
        onChange(program.name);
        if (onIdChange) {
            onIdChange(String(program.id));
        }
    };

    return (
        <div className={className}>
            {/* <ProgramRequirementsLink className="text-xs" /> */}
            {showRequirementLink && <ProgramRequirementsLink
                className="ml-20 text-xs text-orange-600  animate-bounce"
                downloadUrl="/documents/PROGRAMME_AND_REQUIREMENTS.docx"
            />}
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>

            {/* Hidden input to store the selected value */}
            <input
                type="hidden"
                value={value || ''}
                name="program"
            />

            {isEditing ? (
                <>
                    {isLoading && (
                        <div className='w-full flex items-center justify-center py-8'>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                            Loading Programs...
                        </div>
                    )}

                    {(isError || !programs) && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-800">Failed to load programs. Please try again.</p>
                            </div>
                        </div>
                    )}

                    {programs && !isLoading && !isError && (
                        <DetachedProgramAccordionDisplay
                            programs={programs}
                            selectedValue={value || undefined}
                            onProgramSelect={handleProgramSelect}
                            subHeading="Select any program from the parent to the child program..."
                        />
                    )}
                </>
            ) : (
                <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                    {value || <span className="text-gray-400 italic">Not selected</span>}
                </p>
            )}
        </div>
    );
};
// Date Component
export const EditableDate: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isEditing: boolean;
    className?: string;
    min?: string;
    max?: string;
}> = ({ label, value, onChange, placeholder, isEditing, className, min, max }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {isEditing ? (
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                min={min}
                max={max}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
        ) : (
            <p className="mt-1 text-sm text-gray-900 py-2 min-h-[2rem] flex items-center">
                {value ? new Date(value).toLocaleDateString() :
                    <span className="text-gray-400 italic">Not provided</span>}
            </p>
        )}
    </div>
);
