"use client";
import { cn } from "@/lib/utils";
import { ReactNode, useRef, useState } from "react";
import Image from 'next/image';
import { Control, Controller, FieldError, Path, useFormContext, UseFormRegister } from "react-hook-form";
import { Camera } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import Spinner from "@/components/application/Spinner";

// const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

// Define a generic type for FormData
export type FormDataType<T extends string | number | boolean = string> = {
   [key: string]: T; // Allows dynamic keys with a specified type for values
};

// Define the ValidFieldNames type based on the keys of FormData
export type ValidFieldNamesType<T> = Path<T>;

// export type FormData = FormDataType<string | number>; // Specify the type of values (string or number)
// export type ValidFieldNames = ValidFieldNamesType<FormData>; // Generates valid field names


export const FormFieldSet = ({ legend, classList, children }: { legend?: string, classList?: string, children: ReactNode }) => {
   return (
      <fieldset className={cn(`w-full border border-solid border-gray-300 rounded-md px-4 py-7`, classList)}>
         {legend && <legend className="text-2xl text-site-b-light">{legend}</legend>}
         {children}
      </fieldset>
   )
}


// FormFieldProps updated to use dynamic types
export type FormInputFieldProps<T extends FormDataType> = {
   type: string;
   name: ValidFieldNamesType<T>;
   label: string,
   id: string;
   register: UseFormRegister<T>;
   error: FieldError | undefined;
   placeholder?: string;
   valueAsNumber?: boolean;
   classList?: string;
   validationRules?: object;
   value?: string | number;
};
// INPUT FIELD DEFINITION
export const InputFormField = <T extends Record<string, any>>({
   type,
   name,
   id,
   label,
   register,
   error,
   valueAsNumber,
   classList = "",
   validationRules = {},
   value,
}: FormInputFieldProps<T>) => {
   const [visible, setVisible] = useState(false);
   const isPassword = type === "password";

   return (
      <div className={cn(`relative z-0 w-full`, classList)}>
         <input
            // type={type}
            type={isPassword && visible ? "text" : type}
            id={id}
            placeholder={""}
            {...register(name, { ...validationRules, valueAsNumber })}
            value={value && value}
            className={`block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:border-site-b focus:outline-none focus:ring-0 peer ${error ? "border-red-500" : ""}`}
         />
         {(type !== "hidden") &&
            <label htmlFor={name} className={`peer-focus:font-medium absolute text-sm ${(error?.message) ? "text-red-400" : "text-gray-500"} duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-site-b peer-focus:dark:text-site-b peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6`}>
               {label}
               {(error?.message) && ` * ${error?.message}`}
            </label>
         }
         {isPassword && (
            <button
               type="button"
               className="absolute inset-y-0 right-3 flex items-center"
               onClick={() => setVisible((prev) => !prev)}
            >
               {visible ? <EyeOff size={20} color="#ff6c37" /> : <Eye size={20} color="#701401" />}
            </button>
         )}
         {/* {error && <span className="error-message text-red-400 text-xs">{error.message}</span>} */}
      </div>
   );
}

// RADIO BUTTON FIELD DEFINITION
export type RadioButtonFieldProps<T extends FormDataType> = {
   classList?: string;
   label: string;
   name: ValidFieldNamesType<T>;
   register: UseFormRegister<T>;
   error: FieldError | undefined;
   value?: string | number;
   defaultChecked?: boolean;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   valueAsNumber?: boolean;
   validationRules?: object;
}

export const RadiobuttonFormField = <T extends Record<string, any>>({
   label,
   name,
   register,
   error,
   value,
   defaultChecked = false,
   onChange,
   valueAsNumber,
   validationRules = {},
}: RadioButtonFieldProps<T>) => {
   return (
      <div className="flex items-center mb-4 gap-2">
         <input
            id={`option-${value}`}
            type="radio"
            value={value}
            {...register(name, { ...validationRules, valueAsNumber })}
            className="peer/checkbox1 w-7 h-7 border-gray-300 focus:ring-2 focus:ring-site-a-light dark:focus:ring-site-a dark:focus:bg-site-a dark:bg-gray-700 dark:border-gray-600"
            defaultChecked={defaultChecked}
            onChange={onChange}
         />
         <label
            htmlFor={`option-${value}`}
            className={"peer-checked/checkbox1:text-site-a peer-checked/checkbox1:font-bold block ms-2 text-lg font-normal text-gray-900 dark:text-gray-300"}
         >
            {label}
         </label>
         {error && <span className="error-message text-red-400 text-xs">{error.message}</span>}
      </div>
   );
};


// CheckBox FIELD DEFINITION
export type CheckBoxFieldProps<T extends FormDataType> = {
   classList?: string;
   label: ReactNode;
   name: ValidFieldNamesType<T>;
   register: UseFormRegister<T>;
   error: FieldError | undefined;
   value?: string | number;
   defaultChecked?: boolean;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   // valueAsNumber?: boolean;
   validationRules?: object;
}

export const CheckBoxFormField = <T extends Record<string, any>>({
   label,
   name,
   register,
   error,
   value,
   defaultChecked = false,
   onChange,
   // valueAsNumber,
   validationRules = {},
}: CheckBoxFieldProps<T>) => {
   return (
      <div className="flex items-center mb-4 gap-2">
         <input
            id={`boxcheck-${value}`}
            type="checkbox"
            value={value}
            {...register(name, { ...validationRules })}
            className="peer/checkbox1 w-7 h-7 border-gray-300 focus:ring-2 focus:ring-site-a-light dark:focus:ring-site-a dark:focus:bg-site-a dark:bg-gray-700 dark:border-gray-600"
            defaultChecked={defaultChecked}
            onChange={onChange}
         />
         <label
            htmlFor={`boxcheck-${value}`}
            className="peer-checked/checkbox1:text-site-a peer-checked/checkbox1:font-bold block ms-2 text-xl font-normal text-gray-900 dark:text-gray-300"
         >
            {label}
         </label>
         {error && <span className="error-message text-red-400 text-xs">{error.message}</span>}
      </div>
   );
};

// SELECT MENU FIELD DEFINITION
interface SelectFormFieldProps<T extends Record<string, any>> {
   name: keyof T;
   control: Control<T>;
   label?: string;
   error?: FieldError;
   options: { value: string; label: string }[];
   placeholder?: string;
   description?: string | ReactNode;
   rules?: Record<string, any>;
   onValueSelect?: (value: string) => void;
   defaultValue?: string;
}

export const SelectFormField = <T extends Record<string, any>>({
   name,
   control,
   label,
   error,
   options,
   placeholder,
   description,
   rules,
   onValueSelect,
   defaultValue,
}: SelectFormFieldProps<T>) => {
   return (
      <div className="w-full">
         {(label || error?.message) && <label className={`mb-2 block text-sm font-medium text-gray-700 ${(error?.message) ? "text-red-400" : "text-gray-500"}`}>
            {label}
            {(error?.message) && ` * ${error?.message}`}
         </label>}
         <Controller
            name={name as any}
            control={control}
            // rules={{ required: "Faculty is required" }} // Add required validation
            rules={rules}
            render={({ field }) => (
               <Select
                  key={field.value}
                  onValueChange={(value) => {
                     field.onChange(String(value));
                     field.onBlur();
                     if (onValueSelect) {
                        onValueSelect(String(value));
                     }
                  }}
                  value={String(field.value) || ""}
                  defaultValue={defaultValue ?? String(field.value)}
               >
                  <SelectTrigger
                     className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
                  >
                     <SelectValue placeholder={placeholder || "Select an option"}>
                        {field.value ? options.find((opt) => opt.value === field.value)?.label : ""}
                     </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                     className="w-full border border-gray-200 rounded-md shadow-sm bg-white text-gray-800 text-sm"
                  >
                     {options.map((option, index) => (
                        <SelectItem
                           key={`${String(option.value) ?? index}-${String(option.label) ?? index}`}
                           value={String(option.value)}
                           className="cursor-pointer px-3 py-2 hover:bg-orange-100"
                        >
                           {option.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            )}
         />
         {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
         {/* {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>} */}
      </div>
   );
};



// TEXTAREA FIRM FIELD
export type TextareaFieldProps<T extends FormDataType> = {
   placeholder: string;
   name: ValidFieldNamesType<T>;
   id: string;
   register: UseFormRegister<T>;
   error: FieldError | undefined;
   rows?: number;
   cols?: number;
   defaultValue?: any;
   valueAsNumber?: boolean;
   className?: string;
   validationRules?: object;
};
export const TextareaFormField = <T extends Record<string, any>>({
   id,
   placeholder,
   rows,
   cols,
   name,
   register,
   error,
   valueAsNumber,
   className,
   validationRules,
}: TextareaFieldProps<T>) => (
   <div>
      <div className="col-span-full">
         <label htmlFor={name} className={`block text-sm font-medium leading-6 ${(error?.message) ? "text-red-400" : "text-gray-400"} `}>
            {name}
            {(error?.message) && ` * ${error?.message}`}
         </label>
         <div className="mt-2">
            <textarea
               id={id}
               placeholder={placeholder}
               {...register(name, { ...validationRules, valueAsNumber })}
               name={name}
               rows={rows}
               cols={cols}
               className={cn(`px-5 py-3 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-site-b sm:text-sm sm:leading-6`, className)}></textarea>
         </div>
      </div>
      {/* {error && <span className="error-message text-red-400 text-xs">{error.message}</span>} */}
   </div>
);

// FILE INPUT FIELD DEFINITION
export type FileInputFormProps<T extends FormDataType> = {
   title: string;
   name: ValidFieldNamesType<T>;
   id: string;
   register: UseFormRegister<T>;
   error: FieldError | undefined;
   label?: string,
   customError?: string;
   pictureRef?: string,
   uploadableTypes?: string,
   isLoading?: boolean,
   className?: string;
   validationRules?: object;
   onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export const FileInputFormField = <T extends Record<string, any>>({
   title,
   name,
   id,
   register,
   error,
   customError,
   pictureRef,
   uploadableTypes,
   label,
   isLoading,
   className,
   validationRules,
   onChange
}: FileInputFormProps<T>) => {
   const buttonRef = useRef<HTMLLabelElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   const handleClick = () => {
      if (inputRef.current) {
         inputRef.current.click(); // Trigger the file input click
      }
   };

   return (
      <div className={cn(`col-span-full`, className)}>
         <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">{title}</label>
         <div className="mt-2 flex min-h-[300px] justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
               {pictureRef ?
                  <>
                     <Image
                        src={pictureRef}
                        alt="Passport photograph"
                        width={200}
                        height={200}
                        className="mx-auto"
                     />
                  </>
                  : <Camera color="#dccece" width={80} className='mx-auto' />
               }
               <div className="mt-4 flex flex-col justify-center space-y-2 text-sm leading-6 text-gray-600">
                  {isLoading && <div className='my-4'><Spinner border='text-[#dccece]' fill='fill-blue-600' /></div>}
                  {customError && <p className='text-red-400 my-3'>{customError}</p>}
                  <label ref={buttonRef} onClick={handleClick} htmlFor="file-upload" className="relative w-full cursor-pointer rounded-md bg-white font-semibold text-site-b focus-within:outline-none focus-within:ring-2 focus-within:ring-site-btext-site-b focus-within:ring-offset-2 hover:text-site-b-light p-2">
                     <span>{label ?? "Upload a file"}</span>
                     <input
                        id={id}
                        type="file"
                        {...register(name, { ...validationRules })}
                        ref={inputRef}
                        className="sr-only"
                        onChange={onChange}
                     />
                  </label>
                  {/* <p className="pl-1">or drag and drop</p> */}
               </div>
               <p className="text-xs leading-5 text-gray-600 mt-3">{!uploadableTypes && "PNG, JPG, GIF up to 50KB"}</p>
            </div>
         </div>
         {error && <span className="error-message text-red-400 text-xs">{error.message}</span>}
      </div>
   )
}

export const DateInput = ({ label, name, required = true }: { label: string, name: string, required?: boolean }) => {
   const { register, formState: { errors } } = useFormContext();

   return (
      <div className="col-span-full">
         <label htmlFor={name} className={`block text-sm font-medium leading-6 text-gray-900`}>{label}</label>
         <div className="mt-2">
            <input required={required} {...register(name)} type="date" name={name} id={name} />
         </div>
         {errors[name] && (<p className='text-red-400'>{typeof errors[name]?.message === 'string' ? errors[name]?.message : ''}</p>)}
      </div>
   )
}

export const HR = ({ classList }: { classList?: string }) => {
   return (
      <hr className={cn(`my-2`, classList)} />
   )
}

{/* <div className="relative z-0 w-full mb-5 group">
   <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
   <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number (123-456-7890)</label>
</div> */}