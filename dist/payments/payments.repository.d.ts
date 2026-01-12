import { Model } from 'mongoose';
import { PaymentDocument, PaymentStatus } from './schemas/payment.schema.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
export declare class PaymentsRepository {
    private readonly paymentModel;
    constructor(paymentModel: Model<PaymentDocument>);
    create(createDto: CreatePaymentDto): Promise<PaymentDocument>;
    findAll(): Promise<PaymentDocument[]>;
    findById(id: string): Promise<PaymentDocument | null>;
    findByUser(userId: string): Promise<PaymentDocument[]>;
    findByStatus(status: PaymentStatus): Promise<PaymentDocument[]>;
    findByTransactionId(transactionId: string): Promise<PaymentDocument | null>;
    updateStatus(id: string, status: PaymentStatus, transactionId?: string): Promise<PaymentDocument | null>;
    delete(id: string): Promise<PaymentDocument | null>;
    getSummaryByUser(userId: string): Promise<{
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        paymentCount: number;
    }>;
}
