import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldErrors, Path, RegisterOptions } from "react-hook-form";
import { ApplicationFormData } from "@/schemas/admission-schema";
import { EditableFileUpload } from "./EditableDocumentPreviewer";

// Updated FormFieldProps to work with discriminated union
export interface FormFieldProps<TFieldName extends Path<ApplicationFormData>> {
    name: TFieldName;
    control: Control<ApplicationFormData>;
    errors: FieldErrors<ApplicationFormData>;
    label: string;
    required?: boolean;
    type?: 'text' | 'email' | 'date' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number';
    placeholder?: string;
    options?: { value: string; label: string, disabled?: boolean }[];
    rows?: number;
    min?: number;
    max?: number;
    step?: number;
    rules?: Omit<RegisterOptions<ApplicationFormData, TFieldName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
}

// Generic FormField component that works with discriminated union
export const FormField = <TFieldName extends Path<ApplicationFormData>>({
    name,
    control,
    errors,
    label,
    required = false,
    type = 'text',
    placeholder,
    options = [],
    rows = 3,
    min,
    max,
    step,
    rules,
}: FormFieldProps<TFieldName>) => {

    const renderField = (field: any) => {
        switch (type) {
            case 'textarea':
                return (
                    <Textarea
                        {...field}
                        value={field.value ?? ""}
                        id={name}
                        placeholder={placeholder}
                        rows={rows}
                        className="mt-1"
                    />
                );
            case 'select':
                return (
                    <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                    >
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case 'radio':
                return (
                    <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                        className="mt-2"
                    >
                        {options.map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={option.value}
                                    id={`${name}-${option.value}`}
                                    disabled={option?.disabled}
                                />
                                <Label
                                    htmlFor={`${name}-${option.value}`}
                                    className={option?.disabled ? "text-muted-foreground" : ""}
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={name}
                            checked={field.value ?? false}
                            onCheckedChange={(checked) => {
                                field.onChange(checked);
                            }}
                        />
                        <Label htmlFor={name}>{label}</Label>
                    </div>
                );
            case 'number':
                return (
                    <Input
                        {...field}
                        value={field.value ?? ""}
                        id={name}
                        type="number"
                        placeholder={placeholder}
                        min={min}
                        max={max}
                        step={step}
                        className="mt-1"
                        onChange={(e) => {
                            const value = e.target.value === '' ? '' : Number(e.target.value);
                            field.onChange(value);
                        }}
                    />
                );
            default:
                return (
                    <Input
                        {...field}
                        value={field.value ?? ""}
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        className="mt-1"
                    />
                );
        }
    };

    // Helper function to get error message with proper type checking
    const getErrorMessage = (): string | undefined => {
        // Navigate through the error object using the field path
        const path = name.split('.');
        let currentError: any = errors;

        for (const key of path) {
            if (currentError && typeof currentError === 'object' && key in currentError) {
                currentError = currentError[key];
            } else {
                return undefined;
            }
        }

        return currentError?.message;
    };

    const errorMessage = getErrorMessage();

    return (
        <div>
            {type !== 'checkbox' && (
                <Label htmlFor={name}>
                    {label} {required && <span className="text-red-600">*</span>}
                </Label>
            )}
            <Controller
                name={name}
                control={control}
                rules={{
                    ...rules,
                    required: required ? `${label} is required` : false
                }}
                render={({ field }) => renderField(field)}
            />
            {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
        </div>
    );
};

// Updated FileUploadFormFieldProps
interface FileUploadFormFieldProps {
    name: Path<ApplicationFormData>;
    label: string;
    control: Control<ApplicationFormData>;
    errors: FieldErrors<ApplicationFormData>;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    showPreview?: boolean;
    className?: string;
}

export const FileUploadFormField: React.FC<FileUploadFormFieldProps> = ({
    name,
    label,
    control,
    errors,
    accept = ".pdf,.doc,.docx,.jpg,.png",
    multiple = false,
    maxFiles = 5,
    maxSize = 10,
    showPreview = true,
    className
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <div className={className}>
                    <EditableFileUpload
                        label={label}
                        value={multiple ? (Array.isArray(value) ? value : []) : value ? [value] : []}
                        onChange={() => { }}
                        onFilesChange={(files) => {
                            if (multiple) {
                                onChange(files);
                            } else {
                                onChange(files[0] || null);
                            }
                        }}
                        isEditing={true}
                        accept={accept}
                        multiple={multiple}
                        maxFiles={maxFiles}
                        maxSize={maxSize}
                        showPreview={showPreview}
                    />
                    {errors[name as keyof ApplicationFormData] && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors[name as keyof ApplicationFormData]?.message?.toString() || 'This field is required'}
                        </p>
                    )}
                </div>
            )}
        />
    );
};
