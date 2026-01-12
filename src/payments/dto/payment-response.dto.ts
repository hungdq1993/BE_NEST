import {
  PaymentType,
  PaymentStatus,
  PaymentMethod,
} from '../schemas/payment.schema.js';

export class PaymentResponseDto {
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

export class PaymentUrlResponseDto {
  paymentId: string;
  paymentUrl: string;
}

export class PaymentSummaryDto {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentCount: number;
}
