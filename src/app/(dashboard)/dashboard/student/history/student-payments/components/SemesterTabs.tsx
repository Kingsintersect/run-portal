'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SemesterTabsProps {
  activeSemester: 'First' | 'Second';
  onSemesterChange: (semester: 'First' | 'Second') => void;
}

export function SemesterTabs({ activeSemester, onSemesterChange }: SemesterTabsProps) {
  const handleValueChange = (value: string) => {
    // Ensure only valid semester values are passed
    if (value === 'First' || value === 'Second') {
      onSemesterChange(value);
    }
  };

  return (
    <Tabs 
      value={activeSemester} 
      onValueChange={handleValueChange}
      className="w-1/2"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="First">First Semester</TabsTrigger>
        <TabsTrigger value="Second">Second Semester</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}