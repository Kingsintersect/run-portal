import { ProgramCourseSelector } from "./ProgramCourseSelector";
import { PaymentStatusSelector } from "./PaymentStatusSelector";

interface SelectionPanelProps {
    parentPrograms: any[] | null;
    childPrograms: any[] | null;
    selectedProgramId: string | number | null;
    handleProgramChange: (value: string) => void;
    handleCourseChange: (value: string) => void;
    applicationPaymentStatus: any;
    acceptancePaymentStatus: any;
    tuitionPaymentStatus: any;
    tuitionAmount: string;
    statusError: string | null;
    handleApplicationPaymentStatusChange: (status: string) => void;
    handleAcceptancePaymentStatusChange: (status: string) => void;
    handleTuitionPaymentStatusChange: (status: string) => void;
    setTuitionAmount: (amount: string) => void;
}

export const SelectionPanel = (props: SelectionPanelProps) => {
    return (
        <div className="p-10 m-7 border rounded-2xl bg-yellow-50">
            <h2 className="text-lg font-semi-bold text-yellow-600">
                Select the program, course and tuition status to enable file upload...
            </h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 my-5">
                <ProgramCourseSelector
                    parentPrograms={props.parentPrograms}
                    childPrograms={props.childPrograms}
                    selectedProgramId={props.selectedProgramId}
                    handleProgramChange={props.handleProgramChange}
                    handleCourseChange={props.handleCourseChange}
                />
                <PaymentStatusSelector
                    applicationPaymentStatus={props.applicationPaymentStatus}
                    acceptancePaymentStatus={props.acceptancePaymentStatus}
                    tuitionPaymentStatus={props.tuitionPaymentStatus}
                    tuitionAmount={props.tuitionAmount}
                    statusError={props.statusError}
                    handleApplicationPaymentStatusChange={props.handleApplicationPaymentStatusChange}
                    handleAcceptancePaymentStatusChange={props.handleAcceptancePaymentStatusChange}
                    handleTuitionPaymentStatusChange={props.handleTuitionPaymentStatusChange}
                    setTuitionAmount={props.setTuitionAmount}
                />
            </div>
        </div>
    );
};