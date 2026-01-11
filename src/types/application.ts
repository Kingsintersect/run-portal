export type ApplicationStatus =
    | "PENDING"
    | "UNDER_REVIEW"
    | "ACCEPTED"
    | "REJECTED"
    | "WAITLISTED";

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    religion: string;
    lga: string;
    hometown: string;
    hometownAddress: string;
    contactAddress: string;
}

export interface AcademicInfo {
    undergraduateDegree: string;
    university: string;
    gpa: string;
    graduationYear: string;
    gmatScore?: string;
    greScore?: string;
    toeflScore?: string;
}

export interface SponsorInfo {
    sponsorName: string;
    sponsorRelationship: string;
    sponsorEmail: string;
    sponsorPhoneNumber: string;
    sponsorContactAddress: string;
}

export interface Application {
    id: string;
    personalInfo: PersonalInfo;
    academicInfo: AcademicInfo;
    sponsorInfo: SponsorInfo;
    program: string;
    studyMode: string;
    startTerm: string;
    personalStatement: string;
    careerGoals: string;
    has_disability: boolean;
    disability: string;
    status: ApplicationStatus;
    decisionComments?: string;
    createdAt: Date;
    updatedAt: Date;
    reviewedBy?: string;
    reviewedAt?: Date;
}