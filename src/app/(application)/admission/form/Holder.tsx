//  const stepConfig = steps[currentStep];
//         const values = getValues();
//         const fieldsToValidate = typeof stepConfig.getFields === 'function'
//             ? stepConfig.getFields(values)
//             : stepConfig.fields || [];

//         const isStepValid = await trigger(fieldsToValidate as (keyof ApplicationFormData)[]);



// export const FormDataTransformer = {
//     transform(data: ApplicationFormData, programType: ProgramType): ApplicationFormData {
//         const commonData = {
//             ...data,
//             agreeToTerms: data.agreeToTerms || false,
//         };

//         if (programType === ProgramType.ODL) {
//             return {
//                 ...commonData,
//                 undergraduateDegree: '',
//                 university: '',
//                 graduationYear: '',
//                 second_sitting: 'second_sitting' in data ? data.second_sitting : {},
//                 professionalQualification: '',
//                 relevantExperience: '',
//                 professionalMembership: '',
//                 admissionType: ProgramType.ODL,
//             };
//         }

//         return {
//             ...commonData,
//             startTerm: new Date().toISOString(),
//             studyMode: 'online',
//             admissionType: ProgramType.BUSINESS_SCHOOL,
//         };
//     },
// };












// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { AlertCircle, CheckCircle, Loader2, Save, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { SuccessScreen } from "./components/SuccessScreen";
// import { Progress } from "@/components/ui/progress";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";
// import { getAPIFriendlyError, getReactHookFormErrorMessages } from '@/lib/errorsHandler';
// import { submitAdmissionForm } from "@/app/actions/admission-actions";
// import { StepErrorDisplay } from "@/components/forms/FormErrorList";
// import Link from "next/link";
// import { ProgramType, SelectedProgramType, SITE_TITLE } from "@/config";
// import { useApplicationForm } from "@/hooks/useApplicationForm";
// import { PersonalInformationStep } from "./components/form-inputs/PersonalInformationStep";
// import { NextOfKinInformationStep } from "./components/form-inputs/NextOfKinInformationStep";
// import { AcademicBackgroundStep } from "./components/form-inputs/AcademicBackgroundStep";
// import { AcademicCredentialsStep } from "./components/form-inputs/AcademicCredentialsStep";
// import { ProfessionalExperienceStep } from "./components/form-inputs/ProfessionalExperienceStep";
// import { ProgramAndEssaysStep } from "./components/form-inputs/ProgramAndEssaysStep";
// import TermsAndConditions from "./components/form-inputs/TermsAndConditionsContent";
// import { ApplicationFormData } from "@/schemas/admission-schema";
// import { ReviewStep } from "./components/ReviewStep";
// import { AcademinInfoStep } from "./components/form-inputs/odl-forms/AcademinInfoStep";
// import { PassportSumary } from "./components/form-inputs/odl-forms/PassportSumary";
// import { formStorage } from "@/lib/storage";

// const STORAGE_KEY = 'admission_form_progress';
// const CURRENT_STEP_KEY = 'admission_form_current_step';
// const PROGRAM_TYPE_KEY = 'admission_form_program_type';

// const AdmissionForm = () => {
//     const { user, access_token, updateUserInState, refreshUserData } = useAuth();
//     const [currentStep, setCurrentStep] = useState(0);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [lauched, setILunched] = useState(false);
//     const [isSaving, setIsSaving] = useState(false);
//     const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

//     // Use the enhanced hook
//     const { steps, programType, getDefaultValues, ...form } = useApplicationForm(SelectedProgramType as ProgramType);
//     const {
//         handleSubmit,
//         formState: { errors, isValid },
//         trigger,
//         reset,
//         getValues,
//     } = form;

//     // Load saved progress on component mount
//     useEffect(() => {
//         const loadSavedProgress = async () => {
//             try {
//                 const savedStep = localStorage.getItem(CURRENT_STEP_KEY);
//                 const savedData = await formStorage.loadFormData(STORAGE_KEY);

//                 if (savedData) {
//                     reset(savedData);
//                     toast.success("Previous progress loaded successfully!");
//                 }

//                 if (savedStep) {
//                     const stepNumber = parseInt(savedStep);
//                     if (stepNumber >= 0 && stepNumber < steps.length) {
//                         setCurrentStep(stepNumber);
//                     }
//                 }
//             } catch (error) {
//                 console.error("Failed to load saved progress:", error);
//                 toast.error("Failed to load saved progress");
//             }
//         };

//         loadSavedProgress();
//     }, [reset, steps.length]);

//     // Enhanced save progress function
//     const saveProgress = async () => {
//         setIsSaving(true);
//         try {
//             const currentData = getValues();

//             localStorage.setItem(CURRENT_STEP_KEY, currentStep.toString());
//             localStorage.setItem(PROGRAM_TYPE_KEY, programType);

//             // Save full data (including images) to IndexedDB
//             await formStorage.saveFormData(STORAGE_KEY, currentData);

//             toast.success("Progress saved successfully!");
//         } catch (error) {
//             console.error("Failed to save progress:", error);
//             toast.error("Failed to save progress");
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const clearSavedProgress = async () => {
//         try {
//             await formStorage.clearFormData(STORAGE_KEY);
//             localStorage.removeItem(CURRENT_STEP_KEY);
//             localStorage.removeItem(PROGRAM_TYPE_KEY);

//             toast.success("Saved progress cleared.");
//         } catch (error) {
//             console.error("Failed to clear saved progress:", error);
//             toast.error("Failed to clear form data");
//         }
//     };

//     const mutation = useMutation({
//         mutationFn: async (data: ApplicationFormData) => {
//             if (!access_token || typeof access_token !== 'string') {
//                 throw new Error("Missing access token");
//             }
//             // Transform data based on program type
//             const transformedData = programType === ProgramType.ODL
//                 ? {
//                     ...data,
//                     undergraduateDegree: '',
//                     university: '',
//                     graduationYear: '',
//                     second_sitting: 'second_sitting' in data ? data.second_sitting : {},
//                     professionalQualification: '',
//                     relevantExperience: '',
//                     professionalMembership: '',
//                     admissionType: ProgramType.ODL,
//                     agreeToTerms: data.agreeToTerms || false
//                 }
//                 : {
//                     ...data,
//                     startTerm: new Date().toISOString(),//currentStep.toString(),
//                     studyMode: 'online',
//                     admissionType: ProgramType.BUSINESS_SCHOOL,
//                     agreeToTerms: data.agreeToTerms || false
//                 };
//             return submitAdmissionForm(transformedData as ApplicationFormData, access_token);
//         },
//         onSuccess: async () => {
//             setIsSubmitted(true);
//             if (user) {
//                 updateUserInState({ ...user, is_applied: Number(true) });
//             }
//             refreshUserData();
//             clearSavedProgress();
//             toast.success("Application submitted successfully!");
//         },
//         onError: (error) => {
//             console.error("Submission error:", error);
//             toast.error(getAPIFriendlyError(error));
//         },
//     });

//     const nextStep = async () => {
//         const stepConfig = steps[currentStep];
//         const values = getValues();

//         const fieldsToValidate = typeof stepConfig.getFields === 'function'
//             ? stepConfig.getFields(values)
//             : stepConfig.fields || [];

//         const isStepValid = await trigger(fieldsToValidate as (keyof ApplicationFormData)[]);

//         // if (isStepValid && currentStep < steps.length - 1) {
//         //     setCurrentStep(currentStep + 1);
//         //     await saveProgress();
//         // }
//         if (isStepValid) {
//             setStepErrors(prev => ({ ...prev, [currentStep]: [] }));
//             setCurrentStep(currentStep + 1);
//             await saveProgress();
//         } else {
//             // Show step-specific errors without flooding console
//             const currentErrors = getReactHookFormErrorMessages(errors);
//             setStepErrors(prev => ({ ...prev, [currentStep]: currentErrors }));
//         }
//     };

//     const prevStep = () => {
//         if (currentStep > 0) {
//             setCurrentStep(currentStep - 1);
//         }
//     };

//     const onSubmit = (data: ApplicationFormData) => {
//         if (typeof access_token === 'string' && access_token.trim() !== '') {
//             mutation.mutate(data);
//         } else {
//             toast.error("Access token is missing or invalid");
//         }
//     };

//     const handleReset = () => {
//         clearSavedProgress();

//         // Get default values
//         const defaultValues = getDefaultValues(programType);
//         reset(defaultValues);
//         // Clear any step errors
//         setStepErrors({});
//         setCurrentStep(0);

//         // Force re-render of file inputs by triggering form validation
//         setTimeout(() => {
//             trigger();
//         }, 100);
//     };

//     const handleEditSection = (section: string) => {
//         const sectionToStep: Record<string, number> = {
//             personal: 0,
//             nextOfKin: 1,
//             sponsor: 1,
//             business: 2,
//             degree: 2,
//             documents: programType === ProgramType.BUSINESS_SCHOOL ? 3 : 2,
//             terms: programType === ProgramType.BUSINESS_SCHOOL ? 5 : 3,
//         };

//         const stepIndex = sectionToStep[section];
//         if (stepIndex !== undefined && stepIndex < steps.length) {
//             setCurrentStep(stepIndex);
//         }
//     };

//     // Enhanced step rendering with program awareness
//     const renderCurrentStep = () => {
//         const stepConfig = steps[currentStep];

//         // Common steps
//         switch (stepConfig.title) {
//             case 'Personal Information':
//                 return <PersonalInformationStep form={form} />;
//             case 'Next of Kin':
//                 return <NextOfKinInformationStep form={form} />;
//         }

//         // Program-specific steps
//         if (programType === ProgramType.BUSINESS_SCHOOL) {
//             switch (stepConfig.title) {
//                 case 'Academic Background':
//                     return <AcademicBackgroundStep form={form} />;
//                 case 'Academic Credentials':
//                     return <AcademicCredentialsStep form={form} />;
//                 case 'Professional Experience':
//                     return <ProfessionalExperienceStep form={form} />;
//                 case 'Program & Essays':
//                     return <ProgramAndEssaysStep form={form} setILunched={setILunched} />;
//             }
//         } else {
//             switch (stepConfig.title) {
//                 case 'Academic Information':
//                     return <AcademinInfoStep form={form} />;
//                 case 'Passport & Summary':
//                     return <PassportSumary form={form} setILunched={setILunched} />;
//             }
//         }

//         // Final review step
//         if (stepConfig.title === 'Review & Submit') {
//             return <ReviewStep form={form} programType={programType} onEdit={handleEditSection} />;
//         }

//         return null;
//     };

//     if (isSubmitted) {
//         return <SuccessScreen onReset={handleReset} />;
//     }
//     // console.log('Form isValid:', isValid);
//     // console.log('Form errors:', errors);
//     // // Add this debug log in your component
//     // console.log('Current programType:', programType);
//     // console.log('Current form values:', getValues());
//     // REMOVE this useEffect entirely
//     // useEffect(() => {
//     //     trigger();
//     // }, [getValues(), trigger]);

//     return (
//         <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 mt-20">
//             <Link href={"/admission"} className="absolute top-10 right-10 z-50 flex items-center gap-3 p-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors font-bold rounded-lg shadow-md">
//                 Admission Overview
//             </Link>
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-lg md:text-4xl font-bold text-(--color-site-b-dark) mb-2">
//                         {SITE_TITLE} {programType === ProgramType.BUSINESS_SCHOOL ? 'Business School' : 'ODL Program'} Admission
//                     </h1>
//                     <p className="text-lg text-(--color-site-a-dark)">
//                         {programType === ProgramType.BUSINESS_SCHOOL
//                             ? 'Take the next step in your business career'
//                             : 'Start your academic journey with us'}
//                     </p>
//                 </div>

//                 {/* Progress Indicator */}
//                 <div className="mb-8">
//                     <div className="overflow-x-auto">
//                         <div className="flex justify-between items-start md:items-center gap-4 mb-4 min-w-[600px] md:min-w-0">
//                             {steps.map((step, index) => (
//                                 <div key={index} className="flex flex-col items-center flex-shrink-0 w-20">
//                                     <div
//                                         className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2 transition-all duration-300 ${index <= currentStep ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}
//                                     >
//                                         <step.icon className="w-4 h-4 md:w-5 md:h-5" />
//                                     </div>
//                                     <span
//                                         className={`text-[10px] text-center md:text-sm font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
//                                     >
//                                         {step.title}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
//                     {/* <FormErrorList allErrors={allErrors} /> */}
//                     <StepErrorDisplay stepErrors={stepErrors} currentStep={currentStep} />

//                 </div>

//                 {/* Rest of your existing JSX remains the same */}
//                 <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                     <CardHeader className="pb-6">
//                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//                             <div className="text-center sm:text-left">
//                                 <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
//                                     {steps[currentStep].title}
//                                 </CardTitle>
//                                 <CardDescription className="text-gray-600 text-sm sm:text-base">
//                                     Step {currentStep + 1} of {steps.length} • {programType === ProgramType.BUSINESS_SCHOOL ? 'Business School' : 'Degree Program'}
//                                 </CardDescription>
//                             </div>
//                             {/* Save Progress Button */}
//                             <div className="flex flex-col xs:flex-row gap-3 sm:gap-5 justify-center sm:justify-end">
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={handleReset}
//                                     disabled={isSaving}
//                                     className="flex items-center justify-center space-x-2 text-red-600 border-red-200 bg-red-100 hover:bg-red-50 text-sm sm:text-base"
//                                 >
//                                     <X className="w-4 h-4" />
//                                     <span className="whitespace-nowrap">Clear Saved Data</span>
//                                 </Button>
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={saveProgress}
//                                     disabled={isSaving}
//                                     className="flex items-center justify-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50 text-sm sm:text-base"
//                                 >
//                                     {isSaving ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 animate-spin" />
//                                             <span className="whitespace-nowrap">Saving...</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Save className="w-4 h-4" />
//                                             <span className="whitespace-nowrap">Save Progress</span>
//                                         </>
//                                     )}
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardHeader>

//                     <CardContent>
//                         {steps[currentStep].title === 'Review & Submit' ? (
//                             // For review step, render without form wrapper
//                             <div className="space-y-6">
//                                 {renderCurrentStep()}

//                                 {/* Error Display */}
//                                 {mutation.isError && (
//                                     <Alert className="border-red-200 bg-red-50">
//                                         <AlertCircle className="h-4 w-4 text-red-600" />
//                                         <AlertDescription className="text-red-700">
//                                             {getAPIFriendlyError(mutation.error)}
//                                         </AlertDescription>
//                                     </Alert>
//                                 )}

//                                 {/* Navigation Buttons */}
//                                 <div className="flex justify-between pt-6">
//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         onClick={prevStep}
//                                         className="flex items-center space-x-2"
//                                     >
//                                         <span>Previous</span>
//                                     </Button>

//                                     <Button
//                                         type="button"
//                                         onClick={handleSubmit(onSubmit)}
//                                         disabled={!isValid || mutation.isPending}
//                                         className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 rounded-lg"
//                                     >
//                                         {mutation.isPending ? (
//                                             <>
//                                                 <Loader2 className="w-4 h-4 animate-spin" />
//                                                 <span>Submitting...</span>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <CheckCircle className="w-4 h-4" />
//                                                 <span>Submit Application</span>
//                                             </>
//                                         )}
//                                     </Button>
//                                 </div>
//                             </div>
//                         ) : (
//                             // For all other steps, use form wrapper
//                             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//                                 {renderCurrentStep()}

//                                 {/* Error Display */}
//                                 {mutation.isError && (
//                                     <Alert className="border-red-200 bg-red-50">
//                                         <AlertCircle className="h-4 w-4 text-red-600" />
//                                         <AlertDescription className="text-red-700">
//                                             {getAPIFriendlyError(mutation.error)}
//                                         </AlertDescription>
//                                     </Alert>
//                                 )}

//                                 {/* Navigation Buttons */}
//                                 <div className="flex justify-between pt-6">
//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         onClick={prevStep}
//                                         disabled={currentStep === 0}
//                                         className="flex items-center space-x-2"
//                                     >
//                                         <span>Previous</span>
//                                     </Button>

//                                     <div className="flex space-x-3">
//                                         <Button
//                                             type="button"
//                                             variant="secondary"
//                                             onClick={saveProgress}
//                                             disabled={isSaving}
//                                             className="flex items-center space-x-2"
//                                         >
//                                             {isSaving ? (
//                                                 <>
//                                                     <Loader2 className="w-4 h-4 animate-spin" />
//                                                     <span>Saving...</span>
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <Save className="w-4 h-4" />
//                                                     <span>Save</span>
//                                                 </>
//                                             )}
//                                         </Button>

//                                         {currentStep < steps.length - 1 ? (
//                                             <Button
//                                                 type="button"
//                                                 onClick={nextStep}
//                                                 className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
//                                             >
//                                                 <span>Next</span>
//                                             </Button>
//                                         ) : (
//                                             <Button
//                                                 type="submit"
//                                                 disabled={!isValid || mutation.isPending}
//                                                 className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 rounded-lg"
//                                             >
//                                                 {mutation.isPending ? (
//                                                     <>
//                                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                                         <span>Submitting...</span>
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <CheckCircle className="w-4 h-4" />
//                                                         <span>Submit Application</span>
//                                                     </>
//                                                 )}
//                                             </Button>
//                                         )}
//                                     </div>
//                                 </div>
//                             </form>
//                         )}
//                     </CardContent>

//                 </Card>

//                 <div className="text-center mt-8 text-gray-500">
//                     <p>Need help? Contact our admissions team at support@university.edu</p>
//                     <p className="text-sm mt-2">Your progress is automatically saved when you move between steps.</p>
//                 </div>
//             </div>
//             <TermsAndConditions lauched={lauched} setILunched={setILunched} />
//         </div>
//     );
// };

// export default AdmissionForm;
