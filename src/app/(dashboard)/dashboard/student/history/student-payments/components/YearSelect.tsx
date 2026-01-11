
'use client';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface YearSelectProps {
  years: string[];
  defaultValue: string;
  onYearChange?: (year: string) => void;
}

export function YearSelect({ years, defaultValue, onYearChange }: YearSelectProps) {
  return (
    <Select 
      defaultValue={defaultValue} 
      onValueChange={onYearChange || (() => {})}
    >
      <SelectTrigger className="w-full sm:w-[180px] text-black">
        <SelectValue placeholder={defaultValue} />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}