import { ProgramType } from '@/config';
import { UserInterface } from '@/config/Types';
import { z } from 'zod';

// Common constants
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
    "image/jpeg", "image/jpg", "image/png", "image/webp",
    "application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// File validation utility
const fileSchema = z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    .refine(file => ACCEPTED_FILE_TYPES.includes(file.type),
        "Unsupported file type. Only images and documents (PDF, DOC, DOCX) are allowed"
    );

// Common Base Schema (Shared by both programs)
const baseApplicationSchema = z.object({
    // Personal Information (Common)
    // id: z.string().optional(),
    id: z.union([z.string(), z.number()]).optional().transform(val =>
        val !== undefined ? String(val) : undefined
    ),
    lga: z.string().min(1, 'Local Gov. Area is required').default(''),
    religion: z.string().min(2, 'Religion is required').default(''),
    dob: z.string().min(1, 'Date of birth is required').default(''),
    gender: z.string().min(1, 'Gender is required').default(''),
    hometown: z.string().min(2, 'Home town is required').default(''),
    hometown_address: z.string().min(2, 'Home town address is required').default(''),
    contact_address: z.string().min(2, 'Contact address is required').default(''),

    // Sponsor Information (Common)
    has_sponsor: z.boolean().default(false),
    sponsor_name: z.string().optional(),
    sponsor_relationship: z.string().optional(),
    sponsor_email: z.string().email('Invalid email address').optional(),
    sponsor_contact_address: z.string().optional(),
    sponsor_phone_number: z.string().optional(),

    // Next of Kin (Common)
    next_of_kin_name: z.string().min(1, "Full name is required").default(''),
    next_of_kin_relationship: z.string().min(1, "Relationship is required").default(''),
    next_of_kin_phone_number: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long").default(''),
    next_of_kin_address: z.string().min(1, "Address is required").default(''),
    next_of_kin_email: z.string().email().optional(),
    is_next_of_kin_primary_contact: z.boolean().default(false).optional(),
    next_of_kin_alternate_phone_number: z.string().min(10).max(15).optional(),
    next_of_kin_occupation: z.string().optional(),
    next_of_kin_workplace: z.string().optional(),


    // Documents (Common)
    first_school_leaving: fileSchema.optional(),
    o_level: fileSchema.optional(),
    passport: fileSchema.optional(),
    other_documents: z.array(fileSchema).optional(),

    // Additional Information (Common)
    has_disability: z.boolean().default(false),
    disability: z.string().optional().default("None"),
    agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
});

// Business School Specific Schema
export const businessSchoolSchema = baseApplicationSchema.extend({
    programType: z.literal("business_school"),
    awaiting_result: z.boolean().default(true),

    // Academic Information (Business-specific)
    undergraduateDegree: z.string().min(1, 'Undergraduate degree is required').default(''),
    university: z.string().min(2, 'University name is required').default(''),
    gpa: z.string()
        .optional()
        .refine(val => {
            if (!val) return true;
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0 && num <= 5.0;
        }, 'GPA must be between 0.0 and 5.0').default(''),
    graduationYear: z.string().min(4, 'Graduation year is required').default(''),

    // Test Scores (Business-specific)
    gmatScore: z.string().optional(),
    greScore: z.string().optional(),
    toeflScore: z.string().optional(),

    // Professional Experience (Business-specific)
    workExperience: z.string().optional(),
    currentPosition: z.string().optional(),
    company: z.string().optional(),
    yearsOfExperience: z.string().optional(),

    // Essays (Business-specific)
    personalStatement: z.string()
        .min(100, 'Personal statement must be at least 100 characters')
        .max(255, "Personal statement must be under 255 characters").default(''),
    careerGoals: z.string()
        .min(100, 'Career goals must be at least 100 characters')
        .max(250, "Career goals must be under 250 characters").default(''),

    // Business-specific documents
    hnd: fileSchema.optional(),
    degree: fileSchema.optional(),
    degree_transcript: fileSchema.optional(),

    // Program Selection
    startTerm: z.string().min(1, 'Start term is required').default(''),
    studyMode: z.string().min(1, 'Study mode is required').default('online'),
});

// Update your odlProgramSchema
export const odlProgramSchema = baseApplicationSchema.extend({
    programType: z.literal("odl"),

    // Degree-specific fields
    combined_result: z.union([
        z.literal('single_result'),
        z.literal('combined_result'),
        z.literal(''),
    ]).optional().default(''),
    awaiting_result: z.boolean().default(false),

    // Exam Sitting (Degree-specific) - make these optional
    first_sitting_type: z.string().optional(),
    first_sitting_year: z.string().optional(),
    first_sitting_exam_number: z.string().optional(),
    second_sitting_type: z.string().optional(),
    second_sitting_year: z.string().optional(),
    second_sitting_exam_number: z.string().optional(),

    // Degree-specific document fields
    first_sitting_result: fileSchema.optional(),
    second_sitting_result: fileSchema.optional(),
    first_sitting: z.any().optional(),
    second_sitting: z.any().optional(),

    // Program Selection
    startTerm: z.string().min(1, 'Start term is required').default(''),
    studyMode: z.string().min(1, 'Study mode is required').default('online'),
});

// Combined Schema with Refinement
export const applicationSchema = z.discriminatedUnion("programType", [
    businessSchoolSchema,
    odlProgramSchema,
]).superRefine((data, ctx) => {
    // Common validation logic for both programs
    validateSponsorFields(data, ctx);
    validateDisabilityFields(data, ctx);

    // Program-specific validations - ONLY validate required fields for the current program type
    if (data.programType === ProgramType.BUSINESS_SCHOOL) {
        validateBusinessSchoolFields(data, ctx);
    } else if (data.programType === ProgramType.ODL) {
        validateDegreeSittingFields(data, ctx);
    }
});

// Validation functions
function validateSponsorFields(data: BusinessApplication | ODLApplication, ctx: z.RefinementCtx) {
    if (data.has_sponsor) {
        const checks = [
            { field: data.sponsor_name, path: ['sponsor_name'], message: "Sponsor's name is required" },
            { field: data.sponsor_relationship, path: ['sponsor_relationship'], message: "Sponsor's relationship is required" },
            { field: data.sponsor_contact_address, path: ['sponsor_contact_address'], message: "Sponsor's contact address is required", minLength: 10 },
            { field: data.sponsor_phone_number, path: ['sponsor_phone_number'], message: "Sponsor's phone number is required", minLength: 10 },
        ];

        checks.forEach(({ field, path, message, minLength = 1 }) => {
            if (!field || field.trim().length < minLength) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
            }
        });

        // Validate sponsor email separately
        if (!data.sponsor_email || !/\S+@\S+\.\S+/.test(data.sponsor_email)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['sponsor_email'],
                message: "Valid sponsor email is required",
            });
        }
    }
}

function validateDisabilityFields(data: BusinessApplication | ODLApplication, ctx: z.RefinementCtx) {
    if (data.has_disability && (!data.disability || data.disability.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['disability'],
            message: "Please describe your disability",
        });
    }
}

// Add this new validation function
function validateBusinessSchoolFields(data: BusinessApplication, ctx: z.RefinementCtx) {
    // Only validate Business School required fields
    const businessChecks = [
        { field: data.undergraduateDegree, path: ['undergraduateDegree'], message: 'Undergraduate degree is required' },
        { field: data.university, path: ['university'], message: 'University name is required' },
        { field: data.graduationYear, path: ['graduationYear'], message: 'Graduation year is required' },
        // { field: data.startTerm, path: ['startTerm'], message: 'Start term is required' },
        // { field: data.studyMode, path: ['studyMode'], message: 'Study mode is required' },
        { field: data.personalStatement, path: ['personalStatement'], message: 'Personal statement is required' },
        { field: data.careerGoals, path: ['careerGoals'], message: 'Career goals are required' },
    ];

    businessChecks.forEach(({ field, path, message }) => {
        if (!field || field.trim() === '') {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
        }
    });

    // Validate essay lengths
    if (data.personalStatement && data.personalStatement.length < 100) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['personalStatement'],
            message: 'Personal statement must be at least 100 characters',
        });
    }

    if (data.careerGoals && data.careerGoals.length < 100) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['careerGoals'],
            message: 'Career goals must be at least 100 characters',
        });
    }
}

function validateDegreeSittingFields(data: ODLApplication, ctx: z.RefinementCtx) {
    if (!data.awaiting_result) {
        // combined_result is required when not awaiting
        if (!data.combined_result || data.combined_result.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['combined_result'],
                message: "Please select result type",
            });
        }

        // First sitting fields are always required when not awaiting
        const firstSittingChecks = [
            { field: data.first_sitting_type, path: ['first_sitting_type'], message: "First sitting exam type is required" },
            { field: data.first_sitting_year, path: ['first_sitting_year'], message: "First sitting exam year is required" },
            { field: data.first_sitting_exam_number, path: ['first_sitting_exam_number'], message: "First sitting exam number is required" },
            { field: data.first_sitting_result, path: ['first_sitting_result'], message: "First sitting result file is required" },
        ];

        firstSittingChecks.forEach(({ field, path, message }) => {
            // Differentiate validation for strings and files
            if (typeof field === 'string') {
                if (!field || field.trim() === '') {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
                }
            } else if (!field) { // For File objects or other types
                ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
            }
        });

        // Second sitting fields are required only for combined results
        if (data.combined_result === 'combined_result') {
            const secondSittingChecks = [
                { field: data.second_sitting_type, path: ['second_sitting_type'], message: "Second sitting exam type is required for combined results" },
                { field: data.second_sitting_year, path: ['second_sitting_year'], message: "Second sitting exam year is required for combined results" },
                { field: data.second_sitting_exam_number, path: ['second_sitting_exam_number'], message: "Second sitting exam number is required for combined results" },
                { field: data.second_sitting_result, path: ['second_sitting_result'], message: "Second sitting result file is required for combined results" },
            ];

            secondSittingChecks.forEach(({ field, path, message }) => {
                if (typeof field === 'string') {
                    if (!field || field.trim() === '') {
                        ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
                    }
                } else if (!field) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
                }
            });
        }
    }
}


// Type exports
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type BusinessApplication = z.infer<typeof businessSchoolSchema>;
export type ODLApplication = z.infer<typeof odlProgramSchema>;



// EDITING THE FIELDS
//  Schema for personal info chunk
// export const personalInfoSchema = baseSignupSchema.pick({
//     email: true,
//     phone_number: true,
//     nationality: true,
//     gender: true,
// }).extend({
//     userId: baseSignupSchema.shape.id
// });
// export const personalInfoSchema2 = baseApplicationSchema.pick({
//     id: true,
//     lga: true,
//     dob: true,
//     hometown: true,
//     hometown_address: true,
//     contact_address: true,
//     religion: true,
// });
// export const completePersonalInfoSchema = personalInfoSchema.merge(personalInfoSchema2);
// export type PersonalInfoData = z.infer<typeof completePersonalInfoSchema>;


export interface ApplicationDetailsType extends UserInterface {
    application: ApplicationFormData;

    // Add these fields that come from the API response
    academic_session?: string;
    academic_semester?: string;
    status?: 'PENDING' | 'ADMITTED' | 'NOT_ADMITTED' | 'INPROGRESS';
}
