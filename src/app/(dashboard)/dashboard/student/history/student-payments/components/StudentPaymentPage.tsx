"use client";
import Search from '@/components/ui/inputs/Search';
import { baseUrl } from '@/config';
import React, { useEffect, useMemo, useState } from 'react'
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from '@/components/ui/datatable/DataTable';
import { StudentsPaymentTable } from './StudentPaymentsTable';
import { filterData } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { GetStudentPaymentHistory } from '@/app/actions/student';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Payment = {
  id: string;
  type: 'tuition' | 'acceptance';
  status: 'paid' | 'pending' | 'failed';
  session: string;
  amount: string;
  date: string;
  reference: string;
};

export const dynamic = "force-dynamic";

export const PaymentStatusCard = ({
  type,
  latestPayment
}: {
  type: 'tuition' | 'acceptance';
  latestPayment?: Payment
}) => {
  const title = type === 'tuition' ? 'Tuition Fee' : 'Acceptance Fee';
  const paymentLink = type === 'tuition' ? '/dashboard/student/history/student-payments/tuition' : '/dashboard/student/history/student-payments/acceptance';

  return (
    <Card className="p-4 h-full">
      <div className="flex flex-col h-full">
        <h3 className="font-semibold text-xl mb-2">{title} Status</h3>

        {latestPayment ? (
          <>
            <div className="space-y-2 mb-2">
              <p className="text-md text-gray-400 ">Academic Session: <span className='text-gray-100'>{latestPayment.session}</span> </p>
              {/* <p className="font-medium inline">{latestPayment.session}</p> */}
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-md text-gray-400">Status: <span className={`font-medium w-[30%] text-lg rounded-md ${latestPayment.status === 'paid' ? 'text-green-600' :
                latestPayment.status === 'pending' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                {latestPayment.status.charAt(0).toUpperCase() + latestPayment.status.slice(1)}
              </span></p>
              {/* <span className={`font-medium w-[30%] text-lg rounded-md ${
                latestPayment.status === 'paid' ? 'text-green-600' : 
                latestPayment.status === 'pending' ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {latestPayment.status.charAt(0).toUpperCase() + latestPayment.status.slice(1)}
              </span> */}
            </div>

            {latestPayment.status !== 'paid' && (
              <div className="mt-auto">
                <Button asChild variant="default">
                  <Link href={paymentLink}>
                    Pay {title}
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <p className="text-gray-500">No {title.toLowerCase()} record found</p>
            <Button asChild variant="default" className="mt-4">
              <Link href={paymentLink}>
                Pay {title}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

const StudentsPaymentPage = () => {
  const [filter, setFilter] = useState("ALL");
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { access_token } = useAuth();
  const basePath = `${baseUrl}/dashboard/student/history/student-payments`;

  const getAcademicSession = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (month >= 1 && month <= 8) {
      return `${year - 1}/${year}`;
    }
    return `${year}/${year + 1}`;
  };

  const transformPaymentData = (apiData: any[]): Payment[] => {
    return apiData.map(payment => ({
      id: payment.id.toString(),
      type: payment.payment_type.includes('Tuition') ? 'tuition' : 'acceptance',
      status: payment.status.toLowerCase() as 'paid' | 'pending' | 'failed',
      session: getAcademicSession(payment.created_at),
      amount: payment.amount.toString(),
      date: payment.created_at,
      reference: payment.reference,
    }));
  };

  const fetchPaymentHistory = async (access_token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { success, error } = await GetStudentPaymentHistory(access_token);
      if (success) {
        const transformedData = transformPaymentData(success.data);
        const sortedData = transformedData.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPaymentHistory(sortedData);
      } else if (error) {
        setError(error.message || "Failed to fetch payment history");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (access_token) {
      fetchPaymentHistory(access_token).catch(console.error);
    }
  }, [access_token]);

  const latestTuitionPayment = paymentHistory.find(p => p.type === 'tuition');
  const latestAcceptancePayment = paymentHistory.find(p => p.type === 'acceptance');
  const hasPaidAcceptanceFee = paymentHistory.some(
    p => p.type === 'acceptance' && p.status === 'paid'
  );

  const filteredData = useMemo(() => {
    return filterData(
      paymentHistory,
      "type",
      filter,
      ["session", "reference", "type"],
      searchQuery
    );
  }, [filter, searchQuery, paymentHistory]);

  return (
    <div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">Payment History</h3>
        <p className="text-green-800 text-sm">
          Overview of all your Payment Histories are available below.
        </p>
      </div>

      {/* Improved cards layout */}
      {/* <div className='flex flex-col sm:flex-row gap-4 mt-6'>
        <div className={`${hasPaidAcceptanceFee ? 'w-full sm:w-1/2' : 'w-full sm:w-1/2'}`}>
          <PaymentStatusCard 
            type="tuition" 
            latestPayment={latestTuitionPayment} 
          />
        </div>
        
        {!hasPaidAcceptanceFee && (
          <div className="w-full sm:w-1/2">
            <PaymentStatusCard 
              type="acceptance" 
              latestPayment={latestAcceptancePayment} 
            />
          </div>
        )} 
      </div> */}

      <Card className="mt-7 p-4 sm:p-10">
        <div className="font-normal text-gray-700 dark:text-gray-400 space-y-6 sm:space-y-10 mb-7">
          <div className="grid sm:grid-cols-2 gap-3 md:gap-10">
            <div className="search">
              <Search
                name={'search'}
                placeholder='Search by session or reference...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-3 rounded w-full"
              />
            </div>
            <div className="search flex justify-end gap-5">
              <Select
                onValueChange={(value: string) => setFilter(value)}
                defaultValue={filter}
              >
                <SelectTrigger className='w-full sm:w-[280px]'>
                  <SelectValue placeholder="Filter payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Payments</SelectItem>
                  <SelectItem value="tuition">Tuition Fee</SelectItem>
                  <SelectItem value="acceptance">Acceptance Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <DataTable
              columns={StudentsPaymentTable}
              data={filteredData}
              isLoading={loading}
            // noDataMessage={error || "No payment records found"}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StudentsPaymentPage;