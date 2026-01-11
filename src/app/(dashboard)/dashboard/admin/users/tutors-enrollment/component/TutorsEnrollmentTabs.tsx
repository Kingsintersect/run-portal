"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styled from "styled-components";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { notify } from "@/contexts/ToastProvider";
import { useAuth } from '@/contexts/AuthContext';
import { baseUrl } from "@/config";
import { EnrollTutorToCourse, fetchCourses, fetchDepartments, fetchFaculties, fetchPrograms } from "@/app/actions/tutorEnrollment.api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import TutorCourseEnrollmentList from "./TutorCurseEnrollmentList";
import { extractErrorMessages } from "@/lib/errorsHandler";
import { GenericDataType } from '@/types/generic.types';

// Styled Components
const TabsContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: 800px;
    margin: auto;
`;

const TabList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 300px;
    padding: 10px;
    border-right: 2px solid #ddd;
`;

const Tab = styled.button<{ $active: boolean; $disabled: boolean }>`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 16px;
    border: none;
    border-radius: 7px;
    background: ${({ $active }) => ($active ? "#007bff" : "transparent")};
    color: ${({ $active }) => ($active ? "#fff" : "#333")};
    font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
    text-align: left;
    width: 100%;
    transition: all 0.3s ease-in-out;
    font-size: 1.2rem;

    &:hover {
        background: ${({ $disabled }) => ($disabled ? "transparent" : "#0056b3")};
        color: ${({ $disabled }) => ($disabled ? "#333" : "#fff")};
    }
`;

const TabBullet = styled.div<{ $active: boolean }>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $active }) => ($active ? "#fff" : "#007bff")};
    transition: all 0.3s ease-in-out;
`;

const TabContent = styled.div`
    position: relative;
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
    width: 100%;
`;

const Label = styled.label`
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
`;

// const Select = styled.select`
//     width: 100%;
//     padding: 8px;
//     border: 1px solid #ddd;
//     border-radius: 4px;
// `;
const StyledSelect = styled.select`
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Button = styled.button<{ disabled?: boolean }>`
    background: ${({ disabled }) => (disabled ? "#ccc" : "#007bff")};
    color: white;
    border: none;
    padding: 8px 15px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    transition: background 0.3s ease-in-out;

    &:hover {
        background: ${({ disabled }) => (disabled ? "#ccc" : "#0056b3")};
    }
`;
const FlatButton = styled.button`
    color: #6c757d;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 10px;
    text-transform: uppercase;

    &:hover {
        border-bottom: 1px solid blue;
        color: #000;
        font-weight: bold;
    }
`;

// Define the type for Noop function (assuming it's a function that does nothing)
type Noop = () => void;
// Create an interface that extends HTMLSelectElement props but allows null for value
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
    value?: string | number | readonly string[] | null;
    onBlur?: Noop;
    ref?: React.RefCallback<HTMLSelectElement>;
}

// This component converts null to empty string to make TypeScript happy
const Select: React.FC<SelectProps> = ({
    value,
    children,
    onChange,
    onBlur,
    ref,
    ...props
}) => {
    // Convert null to empty string to satisfy the native select element
    const safeValue = value === null ? '' : value;

    return (
        <StyledSelect
            value={safeValue}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            {...props}
        >
            {children}
        </StyledSelect>
    );
};



const schema = z.object({
    programme: z.string().min(1, "Program is required"),
    faculty_id: z.string().min(1, "Faculty is required"),
    department_id: z.string().min(1, "Department is required"),
    course_id: z.string().min(1, "Course is required"),
    review: z.union([z.string(), z.null()]),
});

type ProgramOption = { label: string; value: string };
type FormField = keyof typeof schema.shape; // "programme" | "faculty_id" | "department_id" | "course_id"


const LOCAL_STORAGE_KEY = "tutorEnrollmentForm";
const STEP_STORAGE_KEY = "tutorEnrollmentStep";

interface TutorEnrollmentProps {
    userId: string;
}

const TutorEnrollmentTabs: React.FC<TutorEnrollmentProps> = ({ userId }) => {
    const basePath = `${baseUrl}/dashboard/admin/users/tutors-enrollment/${userId}/enrollment`;
    const router = useRouter();
    const { access_token } = useAuth();
    const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            programme: "",
            faculty_id: "",
            department_id: "",
            course_id: "",
            review: "",
        },
    });

    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== "undefined") {
            const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
            return savedStep !== null ? parseInt(savedStep, 10) : 0;
        }
        return 0;
    });
    // const [reviewData, setReviewData] = useState({});
    const [programs, setPrograms] = useState<ProgramOption[]>([]);
    const [faculties, setFaculties] = useState<ProgramOption[]>([]);
    const [departments, setDepartments] = useState<ProgramOption[]>([]);
    const [courses, setCourses] = useState<ProgramOption[]>([]);
    const [firstSemesterCourses, setFirstSemesterCourses] = useState<GenericDataType[]>([]);
    const [secondSemesterCourses, setSecondSemesterCourses] = useState<GenericDataType[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<"1SM" | "2SM" | null>(null);
    const [atCourseStep, setAtCourseStep] = useState<boolean>(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            const savedStep = localStorage.getItem(STEP_STORAGE_KEY);

            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    Object.keys(parsedData).forEach((key) => {
                        setValue(key as FormField, parsedData[key]);
                    });
                } catch (error) {
                    console.error("Failed to parse saved form data:", error);
                }
            }

            if (savedStep !== null) {
                const parsedStep = parseInt(savedStep, 10);
                if (!isNaN(parsedStep)) {
                    setActiveTab(parsedStep);
                }
            }

            setIsDataLoaded(true);
        }
    }, [setValue]);

    useEffect(() => {
        const subscription = watch((data) => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        localStorage.setItem(STEP_STORAGE_KEY, activeTab.toString());
    }, [activeTab]);

    useEffect(() => {
        fetchPrograms().then((data) => {
            setPrograms(data);
        });
    }, []);

    const selectedProgram = watch("programme");
    const selectedFaculty = watch("faculty_id");
    const selectedDepartment = watch("department_id");
    const selectedCourse = watch("course_id");

    useEffect(() => {
        if (selectedProgram) {
            fetchFaculties(selectedProgram).then((data) => {
                const options = data.map((item) => ({ value: String(item.id), label: item.faculty_name }));
                setFaculties(options)
            });
        }
    }, [selectedProgram, selectedFaculty]);

    useEffect(() => {
        if (selectedFaculty) {
            fetchDepartments(selectedFaculty).then((data) => {
                const options = data.map((item) => ({ value: String(item.id), label: item.department_name }));
                setDepartments(options)
            });
        }
    }, [selectedFaculty]);

    useEffect(() => {
        if (selectedDepartment && selectedProgram && access_token) {
            fetchCourses(access_token, selectedProgram, selectedDepartment).then((data) => {
                setCourses(data)
                const firstSem = data.find((item) => item.semester === "1SM")?.course || [];
                const secondSem = data.find((item) => item.semester === "2SM")?.course || [];
                setFirstSemesterCourses(firstSem);
                setSecondSemesterCourses(secondSem);
            });
        }
    }, [access_token, selectedDepartment, selectedProgram, selectedCourse]);

    const tabs: { title: string; field?: FormField; options?: ProgramOption[] }[] = [
        { title: "Program", field: "programme", options: programs },
        { title: "Faculty", field: "faculty_id", options: faculties },
        { title: "Department", field: "department_id", options: departments },
        { title: "Course", field: "course_id", options: courses },
        { title: "Review & Submit", field: "review" },
    ];
    const ValidateCourseStep = () => {
        if (tabs[activeTab].field === "department_id") {
            setAtCourseStep(true);
        } else setAtCourseStep(false);
    }

    const handleNext = () => {
        if (activeTab < tabs.length - 1) {
            setActiveTab(activeTab + 1);
        }
        ValidateCourseStep();
    };

    const handlePrev = () => {
        if (activeTab > 0) {
            setActiveTab(activeTab - 1);
        }
        if (atCourseStep) ValidateCourseStep();
    };

    const onSubmit = async (data: GenericDataType) => {
        if (!userId) {
            notify({ message: 'Tutor Not Known!', variant: "error", timeout: 5000 });
            return;
        }
        const assignment = { ...data, tutor_id: userId };
        if (access_token) {
            const { error, success } = await EnrollTutorToCourse(access_token, assignment);
            if (error) {
                const errorMessages = extractErrorMessages(error);
                errorMessages.forEach((msg) => {
                    notify({ message: msg, variant: "error", timeout: 10000 });
                });
                return;
            }
            if (success) {
                notify({ message: 'Tutor Successfully Enrolled', variant: "success", timeout: 5000 })
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                localStorage.removeItem(STEP_STORAGE_KEY);
                router.push(`${basePath}`)
                router.refresh();
            }
        } else {
            notify({ message: 'Token not found', variant: "error", timeout: 5000 });
        }
    };

    if (!isDataLoaded) return <p className="flex items-center justify-center"><Loader2 className="animate-spin" color="#d35401" /></p>;

    return (
        <div className="space-y-7" data-selectedSemester={selectedSemester}>
            <div className="bg-white p-10 py-10 rounded-md shadow-md">
                <div className="flex flex-col max-w-[800px] mx-auto text-right ">
                    <h1 className="text-orange-600 text-4xl font-bold">Enroll To Course</h1>
                    <div className="text-gray-700 text-lg">Choose option complete your enrollment</div>
                    <hr className="mt-5" />
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                >
                    <TabsContainer>
                        <TabList>
                            {tabs.map((tab, index) => (
                                <Tab
                                    key={index}
                                    $active={activeTab === index}
                                    $disabled={index > activeTab}
                                    onClick={() => index <= activeTab && setActiveTab(index)}
                                >
                                    <TabBullet $active={activeTab === index} />
                                    {tab.title}
                                </Tab>
                            ))}
                        </TabList>

                        <TabContent>
                            {activeTab === tabs.length - 1 ? (
                                <Table className="w-full text-sm">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-medium p-1">Field</TableHead>
                                            <TableHead className="p-1">Selection</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium p-1">Program</TableCell>
                                            <TableCell className="p-1">{selectedProgram || "Not selected"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium p-1">Faculty</TableCell>
                                            <TableCell className="p-1">
                                                {faculties.find((item) => item.value === selectedFaculty)?.label || "Not selected"}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium p-1">Department</TableCell>
                                            <TableCell className="p-1">
                                                {departments.find((item) => item.value === selectedDepartment)?.label || "Not selected"}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium p-1">Course</TableCell>
                                            <TableCell className="p-1">
                                                {selectedCourse ? (
                                                    courses
                                                        .flatMap((courseGroup: GenericDataType) => courseGroup.course)
                                                        .find((course) => course.course_id == selectedCourse)?.course_title || "Not found"
                                                ) : "Not selected"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            ) : (
                                <>
                                    {(!atCourseStep) ?
                                        (<Controller
                                            name={tabs[activeTab].field as FormField}
                                            control={control}
                                            render={({ field }) => (
                                                <FormGroup>
                                                    <Label>{tabs[activeTab].title}</Label>
                                                    <Select {...field}>
                                                        <option value="">Select {tabs[activeTab].title}</option>
                                                        {tabs[activeTab]?.options?.map(({ value, label }) => (
                                                            <option key={value} value={value}>{label}</option>
                                                        ))}
                                                    </Select>
                                                </FormGroup>
                                            )} />)
                                        :
                                        (<div className="space-y-6">
                                            {/* First Semester Courses */}
                                            {(firstSemesterCourses.length > 0) && <fieldset className="space-y-2">
                                                <Label className="font-bold text-lg">First Semester Courses</Label>
                                                <Controller
                                                    name="course_id"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                setSelectedSemester("1SM");
                                                            }}
                                                            value={field.value} // Ensure controlled component
                                                            className="flex flex-col space-y-2"
                                                        >
                                                            {firstSemesterCourses.map((course) => (
                                                                <div key={course.course_id} className="flex items-center space-x-3">
                                                                    <RadioGroupItem
                                                                        value={course.course_id.toString()}
                                                                        id={`course-${course.course_id}`}
                                                                    />
                                                                    <Label
                                                                        htmlFor={`course-${course.course_id}`}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {course.course_code} - {course.course_title}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </fieldset>}

                                            {/* Second Semester Courses */}
                                            {(secondSemesterCourses.length > 0) && <fieldset className="space-y-2">
                                                <Label className="font-bold text-lg">Second Semester Courses</Label>
                                                <Controller
                                                    name="course_id"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                setSelectedSemester("2SM");
                                                            }}
                                                            value={field.value} // Ensure controlled component
                                                            className="flex flex-col space-y-2"
                                                        >
                                                            {secondSemesterCourses.map((course) => (
                                                                <div key={course.course_id} className="flex items-center space-x-3">
                                                                    <RadioGroupItem
                                                                        value={course.course_id.toString()}
                                                                        id={`course-${course.course_id}`}
                                                                    />
                                                                    <Label
                                                                        htmlFor={`course-${course.course_id}`}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {course.course_code} - {course.course_title}
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </fieldset>}
                                            {/* If Empty */}
                                            {(firstSemesterCourses.length === 0 && secondSemesterCourses.length === 0 && atCourseStep) && (
                                                <p className="text-red-500 text-lg text-center">No Course Found</p>
                                            )}
                                        </div>)
                                    }
                                    {errors[tabs[activeTab].field as FormField] && (
                                        <p className="text-red-500">{errors[tabs[activeTab].field as FormField]?.message}</p>
                                    )}
                                </>
                            )}

                            <div className="flex items-center justify-around">
                                {activeTab > 0 && (
                                    <FlatButton type="button" onClick={handlePrev}>
                                        Previous
                                    </FlatButton>
                                )}
                                {activeTab < tabs.length - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNext();
                                        }}
                                        disabled={!watch(tabs[activeTab].field as FormField)}
                                    >
                                        Next
                                    </Button>

                                ) : (
                                    <Button
                                        type="submit"
                                        className="flex items-center justify-center gap-3"
                                    >
                                        {
                                            (isSubmitting)
                                                ? (
                                                    <>
                                                        {"Enrolling"}
                                                        <Loader2 className="animate-spin" />
                                                    </>
                                                )
                                                : ("Enroll To Course")
                                        }
                                    </Button>
                                )}
                            </div>
                        </TabContent>
                    </TabsContainer>
                </form>
            </div>
        </div>
    );
};

export default TutorEnrollmentTabs;
