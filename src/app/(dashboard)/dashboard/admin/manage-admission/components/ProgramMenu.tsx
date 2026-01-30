import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ProgramItem, StudentFilters } from '../types/student';

interface ProgramMenuProps {
    setFilters: (filters: Partial<StudentFilters>) => void;
    filters: StudentFilters;
    parentPrograms: ProgramItem[];
    childPrograms: ProgramItem[];
    isLoading: boolean;
}

export const ProgramMenu = ({ setFilters, filters, parentPrograms, childPrograms, isLoading }: ProgramMenuProps) => {

    const handleParentChange = (value: string) => {
        if (value === "all") {
            // Clear both parent and child selections
            setFilters({
                parent_program_id: "all",
                program_id: undefined // This won't trigger API call
            });
        } else {
            // Set parent program and clear child program
            setFilters({
                parent_program_id: value,
                program_id: undefined // Clear child program
            });
        }
    };

    const handleChildChange = (value: string) => {
        // This WILL trigger API call because program_id changes
        setFilters({ program_id: value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parent Programs Select - Doesn't trigger API */}
            {parentPrograms?.length > 0 && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Program/Department</label>
                    <Select
                        value={filters.parent_program_id || ''}
                        onValueChange={handleParentChange}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a programme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Programme</SelectLabel>
                                <SelectItem value="all">All Programs</SelectItem>
                                {parentPrograms.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Child Programs Select - Triggers API when changed */}
            {filters.parent_program_id && filters.parent_program_id !== "all" && filters.parent_program_id && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Course/Sub-program</label>
                    <Select
                        value={filters.program_id || ''}
                        onValueChange={handleChildChange}
                        disabled={isLoading || childPrograms.length === 0}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={
                                childPrograms.length === 0
                                    ? "No courses available"
                                    : "Select a course"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Courses</SelectLabel>
                                <SelectItem value="all">All Courses</SelectItem>
                                {childPrograms.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {childPrograms.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No courses available for this program
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};