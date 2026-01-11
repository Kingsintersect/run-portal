// src/components/DynamicSelect.tsx
import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Controller } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface DynamicSelectProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  fetchOptions: () => Promise<Option[]>;
}

const DynamicSelect: React.FC<DynamicSelectProps> = ({ label, value, onChange, fetchOptions }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchOptions().then((data) => {
      setOptions(data);
      setLoading(false);
    });
  }, [fetchOptions]);

  return (
    <Select onValueChange={onChange} value={value} disabled={loading}>
      <SelectTrigger>{value || `Select ${label}`}</SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DynamicSelect;

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  control: any;
  name: string;
  fetchOptions: () => Promise<Option[]>;
  label: string;
  onSelect: () => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ control, name, fetchOptions, label, onSelect }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchOptions().then((data) => {
      setOptions(data);
      setLoading(false);
    });
  }, [fetchOptions]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select onValueChange={(val) => { field.onChange(val); onSelect(); }} value={field.value} disabled={loading}>
          <SelectTrigger>{field.value || `Select ${label}`}</SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
};
