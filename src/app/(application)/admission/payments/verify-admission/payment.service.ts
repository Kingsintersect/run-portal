import { remoteApiUrl } from '@/config';
import { PaymentVerificationRequest, PaymentVerificationResponse } from '@/schemas/payment.schema';

export class PaymentService {
    static async verifyPayment(data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
        const response = await fetch(`${remoteApiUrl}/application/verify-purchase?transRef=${data.transRef}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Payment verification failed');
        }

        return response.json();
    }
    static async verifyAcceptancePayment(data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
        const response = await fetch(`${remoteApiUrl}/application/verify-acceptance?transRef=${data.transRef}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Payment verification failed');
        }

        return response.json();
    }

    static async verifyTuitionPayment(data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
        const response = await fetch(`${remoteApiUrl}/application/verify-tuition?transRef=${data.transRef}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Payment verification failed');
        }

        return response.json();
    }
}


// Mock function - replace with actual CredoCentral integration
export async function verifyWithCredoCentral(paymentRef: string): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock verification logic
    return paymentRef.startsWith('CREDO');
}

// Mock function - replace with actual user authentication
export async function authenticateUser(referenceNumber: string, password: string) {
    // Simulate database lookup
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (password === 'password123') {
        return {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            referenceNumber,
        };
    }

    return null;
}