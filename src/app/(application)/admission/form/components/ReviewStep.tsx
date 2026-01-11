import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, Users, GraduationCap, BookOpen, Award, Edit } from "lucide-react";
import { ApplicationFormData, BusinessApplication, ODLApplication } from "@/schemas/admission-schema";
import React from "react";
import { ProgramType } from "@/config";

interface ReviewStepProps {
    form: UseFormReturn<ApplicationFormData>;
    programType: ProgramType;
    onEdit?: (section: string) => void;
}
type RenderFieldValue = string | number | boolean | File | File[] | null | undefined;

export const ReviewStep: React.FC<ReviewStepProps> = ({ form, programType, onEdit }) => {
    const { getValues } = form;
    const values = getValues();

    // Type guards
    const isBusinessApplication = (data: ApplicationFormData): data is BusinessApplication => {
        return data.programType === ProgramType.BUSINESS_SCHOOL;
    };

    const isODLApplication = (data: ApplicationFormData): data is ODLApplication => {
        return data.programType === ProgramType.ODL;
    };

    const renderSection = (title: string, icon: React.ElementType, content: React.ReactNode, sectionKey: string) => (
        <Card className="mb-6">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {React.createElement(icon, { className: "w-5 h-5 text-blue-600" })}
                        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    </div>
                    {onEdit && (
                        <Button
                            type='button'
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(sectionKey)}
                            className="flex items-center space-x-1"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    );

    const renderField = (
        label: string,
        value: RenderFieldValue,
        type: 'text' | 'date' | 'email' | 'phone' | 'file' = 'text'
    ) => {
        if (!value || value === '' || (typeof value === 'boolean' && !value)) return null;

        const formatValue = () => {
            switch (type) {
                case 'date':
                    // Only string and number are valid for Date constructor
                    if (typeof value === 'string' || typeof value === 'number') {
                        return new Date(value).toLocaleDateString();
                    }
                    return String(value);
                case 'email':
                case 'phone':
                    // Only string values are valid for email and phone
                    if (typeof value === 'string') {
                        return type === 'email'
                            ? <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>
                            : <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;
                    }
                    return String(value);
                case 'file':
                    if (Array.isArray(value)) {
                        return value.map((file, index) => (
                            <div key={index} className="text-sm text-gray-600">
                                {file.name || 'Uploaded file'}
                            </div>
                        ));
                    }
                    if (value instanceof File) {
                        return <div className="text-sm text-gray-600">{value.name || 'Uploaded file'}</div>;
                    }
                    return String(value);
                default:
                    return String(value);
            }
        };

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700">{label}:</span>
                <span className="md:col-span-2 text-gray-900">{formatValue()}</span>
            </div>
        );
    };

    const renderBooleanField = (label: string, value: boolean) => (
        <div className="flex items-center space-x-2 py-2 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-700">{label}:</span>
            <Badge variant={value ? "default" : "secondary"}>
                {value ? "Yes" : "No"}
            </Badge>
        </div>
    );

    // Personal Information Section
    const personalInfoContent = (
        <div className="space-y-1">
            {renderField("Local Government Area", values.lga)}
            {renderField("Religion", values.religion)}
            {renderField("Date of Birth", values.dob, 'date')}
            {renderField("Gender", values.gender)}
            {renderField("Hometown", values.hometown)}
            {renderField("Hometown Address", values.hometown_address)}
            {renderField("Contact Address", values.contact_address)}
            {renderBooleanField("Has Disability", values.has_disability)}
            {values.has_disability && renderField("Disability Description", values.disability)}
        </div>
    );

    // Next of Kin Section
    const nextOfKinContent = (
        <div className="space-y-1">
            {renderField("Name", values.next_of_kin_name)}
            {renderField("Relationship", values.next_of_kin_relationship)}
            {renderField("Phone Number", values.next_of_kin_phone_number, 'phone')}
            {renderField("Address", values.next_of_kin_address)}
            {renderField("Email", values.next_of_kin_email, 'email')}
            {renderField("Occupation", values.next_of_kin_occupation)}
            {renderField("Workplace", values.next_of_kin_workplace)}
            {renderBooleanField("Is Primary Contact", Boolean(values.is_next_of_kin_primary_contact))}
            {renderField("Alternate Phone", values.next_of_kin_alternate_phone_number, 'phone')}
        </div>
    );

    // Sponsor Information Section
    const sponsorContent = (
        <div className="space-y-1">
            {renderBooleanField("Has Sponsor", values.has_sponsor)}
            {values.has_sponsor && (
                <>
                    {renderField("Sponsor Name", values.sponsor_name)}
                    {renderField("Sponsor Relationship", values.sponsor_relationship)}
                    {renderField("Sponsor Email", values.sponsor_email, 'email')}
                    {renderField("Sponsor Contact Address", values.sponsor_contact_address)}
                    {renderField("Sponsor Phone Number", values.sponsor_phone_number, 'phone')}
                </>
            )}
        </div>
    );

    // Business School Specific Content
    const businessSchoolContent = isBusinessApplication(values) ? (
        <div className="space-y-4">
            {/* Academic Background */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Academic Background</h4>
                <div className="space-y-1">
                    {renderField("Undergraduate Degree", values.undergraduateDegree)}
                    {renderField("University", values.university)}
                    {renderField("Graduation Year", values.graduationYear)}
                    {renderField("GPA", values.gpa)}
                    {renderBooleanField("Awaiting Results", values.awaiting_result)}
                </div>
            </div>

            {/* Test Scores */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Test Scores</h4>
                <div className="space-y-1">
                    {renderField("GMAT Score", values.gmatScore)}
                    {renderField("GRE Score", values.greScore)}
                    {renderField("TOEFL Score", values.toeflScore)}
                </div>
            </div>

            {/* Professional Experience */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Professional Experience</h4>
                <div className="space-y-1">
                    {renderField("Work Experience", values.workExperience)}
                    {renderField("Current Position", values.currentPosition)}
                    {renderField("Company", values.company)}
                    {renderField("Years of Experience", values.yearsOfExperience)}
                </div>
            </div>

            {/* Program Selection */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Program Details</h4>
                <div className="space-y-1">
                    {renderField("Start Term", values.startTerm)}
                    {renderField("Study Mode", values.studyMode)}
                </div>
            </div>

            {/* Essays */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Essays</h4>
                <div className="space-y-3">
                    {values.personalStatement && (
                        <div>
                            <h5 className="font-medium text-gray-700 mb-1">Personal Statement</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                {values.personalStatement.length > 200
                                    ? `${values.personalStatement.substring(0, 200)}...`
                                    : values.personalStatement
                                }
                            </p>
                        </div>
                    )}
                    {values.careerGoals && (
                        <div>
                            <h5 className="font-medium text-gray-700 mb-1">Career Goals</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                {values.careerGoals.length > 200
                                    ? `${values.careerGoals.substring(0, 200)}...`
                                    : values.careerGoals
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;

    // ODL Program Specific Content
    const degreeProgramContent = isODLApplication(values) ? (
        <div className="space-y-4">
            {/* Academic Information */}
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Academic Information</h4>
                <div className="space-y-1">
                    {renderBooleanField("Awaiting Results", values.awaiting_result)}
                    {!values.awaiting_result && renderField("Result Type", values.combined_result)}
                </div>
            </div>

            {/* Exam Details */}
            {!values.awaiting_result && (
                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Exam Details</h4>
                    <div className="space-y-3">
                        {/* First Sitting */}
                        <div className="bg-gray-50 p-3 rounded-md">
                            <h5 className="font-medium text-gray-700 mb-2">First Sitting</h5>
                            <div className="space-y-1">
                                {renderField("Exam Type", values.first_sitting_type)}
                                {renderField("Exam Year", values.first_sitting_year)}
                                {renderField("Exam Number", values.first_sitting_exam_number)}
                            </div>
                        </div>

                        {/* Second Sitting */}
                        {values.combined_result === 'combined_result' && (
                            <div className="bg-gray-50 p-3 rounded-md">
                                <h5 className="font-medium text-gray-700 mb-2">Second Sitting</h5>
                                <div className="space-y-1">
                                    {renderField("Exam Type", values.second_sitting_type)}
                                    {renderField("Exam Year", values.second_sitting_year)}
                                    {renderField("Exam Number", values.second_sitting_exam_number)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    ) : null;

    // Documents Section
    const documentsContent = (
        <div className="space-y-3">
            {renderField("Passport Photo", values.passport, 'file')}
            {renderField("First School Leaving Certificate", values.first_school_leaving, 'file')}
            {renderField("O'Level Results", values.o_level, 'file')}

            {isBusinessApplication(values) && (
                <>
                    {renderField("HND Certificate", values.hnd, 'file')}
                    {renderField("Degree Certificate", values.degree, 'file')}
                    {renderField("Degree Transcript", values.degree_transcript, 'file')}
                </>
            )}

            {values.other_documents && Array.isArray(values.other_documents) && values.other_documents.length > 0 && (
                <div>
                    <h4 className="font-medium text-gray-700 mb-2">Other Documents</h4>
                    {values.other_documents.map((doc, index) => (
                        <div key={index} className="text-sm text-gray-600">
                            {doc.name || `Document ${index + 1}`}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Terms and Conditions
    const termsContent = (
        <div className="space-y-1">
            {renderBooleanField("Agreed to Terms and Conditions", values.agreeToTerms)}
            {values.agreeToTerms && (
                <div className="bg-green-50 p-3 rounded-md mt-2">
                    <p className="text-sm text-green-700">
                        You have agreed to the terms and conditions of the application process.
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Program Badge */}
            <div className="flex justify-center mb-6">
                <Badge variant="secondary" className="px-4 py-2 text-lg">
                    {programType === ProgramType.BUSINESS_SCHOOL ? 'Business School Application' : 'Degree Program Application'}
                </Badge>
            </div>

            {/* Review Sections */}
            {renderSection("Personal Information", User, personalInfoContent, "personal")}
            {renderSection("Next of Kin Information", Users, nextOfKinContent, "nextOfKin")}
            {renderSection("Sponsor Information", Users, sponsorContent, "sponsor")}

            {/* Program Specific Sections */}
            {programType === ProgramType.BUSINESS_SCHOOL && businessSchoolContent &&
                renderSection("Business School Details", GraduationCap, businessSchoolContent, "business")
            }
            {programType === ProgramType.ODL && degreeProgramContent &&
                renderSection("Degree Program Details", BookOpen, degreeProgramContent, "degree")
            }

            {renderSection("Documents", FileText, documentsContent, "documents")}
            {renderSection("Terms and Conditions", Award, termsContent, "terms")}

            {/* Summary Stats */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {Object.keys(values).filter(key => {
                                    const value = values[key as keyof ApplicationFormData];
                                    return value !== null && value !== undefined && value !== '' &&
                                        (!Array.isArray(value) || value.length > 0);
                                }).length}
                            </div>
                            <div className="text-sm text-blue-700">Fields Completed</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">
                                {values.agreeToTerms ? 'Ready' : 'Pending'}
                            </div>
                            <div className="text-sm text-green-700">Submission Status</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600">
                                {programType === ProgramType.BUSINESS_SCHOOL ? 'MBA' : 'BSc'}
                            </div>
                            <div className="text-sm text-purple-700">Program Type</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Please review all information carefully before submission</li>
                        <li>• Ensure all uploaded documents are clear and legible</li>
                        <li>• Incomplete applications may be rejected</li>
                        <li>• You will receive a confirmation email after submission</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};
