import React, { FC } from 'react';

interface SwitchToggleProps {
    classList?: string;
    label?: string;
    name?: string;
    ref?: any;
    disabled?: boolean;
    checked?: boolean; // Controlled checked state
    activeColor?: string;
    inactiveColor?: string;
    onChange: (status: number) => void; // Handler to propagate the change
}

const SwitchToggle: FC<SwitchToggleProps> = ({
    classList,
    label,
    name,
    ref,
    disabled,
    checked,
    activeColor = "#9a3412",
    inactiveColor = "#f97316",
    onChange,
    ...props
}) => {

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Convert the checkbox status to 1 (checked) or 0 (unchecked)
        const status = e.target.checked ? 1 : 0;
        onChange(status); // Notify parent about the status change
    };

    return (
        <div className={classList}>
            <label className="inline-flex items-center mb-5 cursor-pointer">
                <input
                    type="checkbox"
                    name={name}
                    ref={ref}
                    className="sr-only peer"
                    disabled={disabled}
                    checked={checked} // Controlled checkbox state
                    {...props}
                    onChange={handleCheckboxChange} // Handle change
                />
                <div
                    className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-site-a-light dark:peer-focus:ring-site-a rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-site-b dark:bg-site-b-light dark:peer-checked:bg-site-b-light ${checked ? `bg-[${activeColor}]` : `bg-[${inactiveColor}]`}`}
                ></div>
                <span className="ms-3 text-xl text-gray-500">{label}</span>
            </label>
        </div>
    );
};

export default SwitchToggle;
