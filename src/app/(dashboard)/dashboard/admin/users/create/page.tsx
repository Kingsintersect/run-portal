"use client";

import FileUploader from "./components/FileUploader";
import FilePreview from "./components/FilePreview";
import DataTable from "./components/DataTable";
import UploadStatusIndicator from "./components/UploadStatusIndicator";
import SubmitButton from "./components/SubmitButton";
import TemplateDownloadButton from "./components/TemplateDownloadButton";
import { notify } from "@/contexts/ToastProvider";

import { CreateUserCard } from "./components/CreateUserCard";
import { SelectionPanel } from "./components/SelectionPanel";
import { useCreateUsers, UserData } from "@/hooks/useCreateUsers";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useProgramCourseSelection } from "@/hooks/useProgramCourseSelection";

export default function CreateUsersPage() {
   const {
      fileData,
      currentFile,
      uploadState,
      basePath,
      handleFileDataReceived,
      handleRemoveFile,
      handleUpload
   } = useCreateUsers();

   const {
      tuitionPaymentStatus,
      applicationPaymentStatus,
      acceptancePaymentStatus,
      statusError,
      tuitionAmount,
      setTuitionAmount,
      handleTuitionPaymentStatusChange,
      handleApplicationPaymentStatusChange,
      handleAcceptancePaymentStatusChange,
      isTuitionAmountValid,
      isApplicationStatusValid,
      isAcceptanceStatusValid
   } = usePaymentStatus();

   const {
      parentPrograms,
      childPrograms,
      selectedProgramId,
      selectedCourseId,
      selectedProgramName,
      selectedCourseName,
      handleProgramChange,
      handleCourseChange
   } = useProgramCourseSelection();

   const areSelectionsComplete =
      Boolean(selectedProgramId) &&
      Boolean(selectedCourseId) &&
      Boolean(isApplicationStatusValid) &&
      Boolean(isAcceptanceStatusValid) &&
      isTuitionAmountValid;

   const handleFileUpload = (data: Record<string, unknown>[], file: File) => {
      const enrichmentData = {
         programName: selectedProgramName,
         courseName: selectedCourseName,
         tuitionPaymentStatus: tuitionPaymentStatus ?? "",
         tuitionAmount,
         applicationPaymentStatus: applicationPaymentStatus ?? "",
         acceptancePaymentStatus: acceptancePaymentStatus ?? ""
      };
      // Map data to UserData[] type
      const userData: UserData[] = data.map((item) => ({
         firstName: String(item.firstName ?? ""),
         lastName: String(item.lastName ?? ""),
         email: String(item.email ?? ""),
         role: String(item.role ?? ""),
         ...item
      })) as UserData[];
      handleFileDataReceived(userData, file, enrichmentData);
   };

   const handleFormSubmit = async () => {
      if (!areSelectionsComplete) {
         notify({ message: "Please select the program, course and payment status!", variant: "error", timeout: 5000 });
         return;
      }

      const formData = new FormData();
      formData.append("file", currentFile!);
      formData.append("programId", String(selectedProgramId));
      formData.append("courseId", selectedCourseId);
      formData.append("tuition_payment_status", tuitionPaymentStatus!);
      formData.append("application_payment_status", applicationPaymentStatus ?? "0");
      formData.append("acceptance_fee_payment_status", acceptancePaymentStatus ?? "0");
      if (tuitionAmount) {
         formData.append("tuitionAmount", tuitionAmount);
      }

      await handleUpload(formData);
   };

   return (
      <div className="container mx-auto py-8">
         <div className="max-w-7xl mx-auto min-h-screen bg-gray-50 p-6 space-y-7">
            <CreateUserCard basePath={basePath} />

            <div className="shadow-xl rounded-xl w-full">
               {/* Header */}
               <div className="border-b bg-gray-50 p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-2xl font-bold text-gray-700">Upload Users Via CSV.</h2>
                        <p className="text-gray-600 mt-1">
                           Upload multiple users at once using CSV or Excel file
                        </p>
                     </div>
                     <TemplateDownloadButton />
                  </div>
               </div>

               <hr />

               <SelectionPanel
                  parentPrograms={parentPrograms}
                  childPrograms={childPrograms}
                  selectedProgramId={selectedProgramId}
                  handleProgramChange={handleProgramChange}
                  handleCourseChange={handleCourseChange}
                  applicationPaymentStatus={applicationPaymentStatus}
                  acceptancePaymentStatus={acceptancePaymentStatus}
                  tuitionPaymentStatus={tuitionPaymentStatus}
                  tuitionAmount={tuitionAmount}
                  statusError={statusError}
                  handleApplicationPaymentStatusChange={handleApplicationPaymentStatusChange}
                  handleAcceptancePaymentStatusChange={handleAcceptancePaymentStatusChange}
                  handleTuitionPaymentStatusChange={handleTuitionPaymentStatusChange}
                  setTuitionAmount={setTuitionAmount}
               />

               <div className="p-6 space-y-6">
                  {/* File Uploader or File Preview */}
                  {!currentFile ? (
                     <div className={!areSelectionsComplete ? "opacity-50 pointer-events-none" : ""}>
                        <FileUploader
                           onFileDataReceived={handleFileUpload}
                           disabled={!areSelectionsComplete}
                        />
                        {!areSelectionsComplete && (
                           <p className="text-center text-amber-600 mt-2">
                              Please select both program and course to enable file upload
                           </p>
                        )}
                     </div>
                  ) : (
                     <FilePreview
                        file={currentFile}
                        recordCount={fileData.length}
                        onRemove={handleRemoveFile}
                     />
                  )}

                  <UploadStatusIndicator state={uploadState} />

                  {fileData.length > 0 && (
                     <DataTable data={fileData} />
                  )}

                  <SubmitButton
                     disabled={!currentFile || uploadState.status === 'uploading' || !areSelectionsComplete}
                     isUploading={uploadState.status === 'uploading'}
                     recordCount={fileData.length}
                     onClick={handleFormSubmit}
                     className="bg-green-200 hover:bg-green-300 text-gray-800"
                  />
               </div>

               <div className="bg-gray-50 border-t p-4 text-center text-sm text-gray-500 rounded-b-xl">
                  Need help? Contact the system administrator or refer to the documentation.
               </div>
            </div>
         </div>
      </div>
   );
}
