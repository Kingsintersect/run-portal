import { PaymentStatus } from "@/lib/definitions";
import SetPaymentStatusRecord from "./SetPaymentStatusRecord";

interface PaymentStatusSelectorProps {
    applicationPaymentStatus: PaymentStatus;
    acceptancePaymentStatus: PaymentStatus;
    tuitionPaymentStatus: PaymentStatus;
    tuitionAmount: string;
    statusError: string | null;
    handleApplicationPaymentStatusChange: (status: string) => void;
    handleAcceptancePaymentStatusChange: (status: string) => void;
    handleTuitionPaymentStatusChange: (status: string) => void;
    setTuitionAmount: (amount: string) => void;
}

export const PaymentStatusSelector = ({
    applicationPaymentStatus,
    acceptancePaymentStatus,
    tuitionPaymentStatus,
    tuitionAmount,
    statusError,
    handleApplicationPaymentStatusChange,
    handleAcceptancePaymentStatusChange,
    handleTuitionPaymentStatusChange,
    setTuitionAmount
}: PaymentStatusSelectorProps) => {
    return (
        <div className="w-full space-y-5">
            <h3 className="text-center">Payment Statuses</h3>
            <SetPaymentStatusRecord
                statusType="application_payment_status"
                status={applicationPaymentStatus}
                statusError={statusError}
                handleStatusChange={handleApplicationPaymentStatusChange}
            />
            <SetPaymentStatusRecord
                statusType="acceptance_fee_payment_status"
                status={acceptancePaymentStatus}
                statusError={statusError}
                handleStatusChange={handleAcceptancePaymentStatusChange}
            />
            <SetPaymentStatusRecord
                statusType="tuition_payment_status"
                status={tuitionPaymentStatus}
                amount={tuitionAmount}
                statusError={statusError}
                handleStatusChange={handleTuitionPaymentStatusChange}
                setAmount={setTuitionAmount}
            />
        </div>
    );
};