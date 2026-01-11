import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProgramCourseSelectorProps {
    parentPrograms: any[] | null;
    childPrograms: any[] | null;
    selectedProgramId: string | number | null;
    handleProgramChange: (value: string) => void;
    handleCourseChange: (value: string) => void;
}

export const ProgramCourseSelector = ({
    parentPrograms,
    childPrograms,
    selectedProgramId,
    handleProgramChange,
    handleCourseChange
}: ProgramCourseSelectorProps) => {
    return (
        <div className="w-full space-y-5">
            <h3 className="text-center">Program and Courses</h3>
            {parentPrograms && (
                <Select onValueChange={handleProgramChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a program" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Programs</SelectLabel>
                            {parentPrograms.map((item, i) => (
                                <SelectItem key={i} value={item.value}>{item.label}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}
            {childPrograms && (
                <Select
                    onValueChange={handleCourseChange}
                    disabled={!selectedProgramId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Program Courses</SelectLabel>
                            {childPrograms.map((item, i) => (
                                <SelectItem key={i} value={item.value}>{item.label}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}
        </div>
    );
};