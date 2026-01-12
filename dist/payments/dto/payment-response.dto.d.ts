import { PaymentType, PaymentStatus, PaymentMethod } from '../schemas/payment.schema.js';
export declare class PaymentResponseDto {
    id: string;
    userId: string;
    userName?: string;
    amount: number;
    type: PaymentType;
    status: PaymentStatus;
    method?: PaymentMethod;
    transactionId?: string;
    referenceId?: string;
    referenceModel?: string;
    description?: string;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaymentUrlResponseDto {
    paymentId: string;
    paymentUrl: string;
}
export declare class PaymentSummaryDto {
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    paymentCount: number;
}
