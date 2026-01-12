import { PaymentType, PaymentMethod } from '../schemas/payment.schema.js';
export declare class CreatePaymentDto {
    userId: string;
    amount: number;
    type: PaymentType;
    method?: PaymentMethod;
    referenceId?: string;
    referenceModel?: 'Match' | 'MonthlyFee' | 'Penalty';
    description?: string;
}
