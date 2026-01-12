import type { Request } from 'express';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { VnpayCallbackDto, MomoCallbackDto, CassoWebhookDto } from './dto/payment-callback.dto.js';
import { PaymentResponseDto, PaymentUrlResponseDto, PaymentSummaryDto } from './dto/payment-response.dto.js';
import { BankTransferResponseDto } from './dto/bank-transfer-response.dto.js';
import { AdminConfirmPaymentDto } from './dto/admin-confirm-payment.dto.js';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createDto: CreatePaymentDto): Promise<PaymentResponseDto>;
    findAll(): Promise<PaymentResponseDto[]>;
    findMyPayments(user: any): Promise<PaymentResponseDto[]>;
    getMySummary(user: any): Promise<PaymentSummaryDto>;
    findOne(id: string): Promise<PaymentResponseDto>;
    createVnpayPayment(id: string, req: Request): Promise<PaymentUrlResponseDto>;
    createMomoPayment(id: string): Promise<PaymentUrlResponseDto>;
    createBankTransferPayment(id: string): Promise<BankTransferResponseDto>;
    vnpayCallback(callback: VnpayCallbackDto): Promise<PaymentResponseDto>;
    momoCallback(callback: MomoCallbackDto): Promise<PaymentResponseDto>;
    cassoWebhook(webhook: CassoWebhookDto): Promise<PaymentResponseDto>;
    cancelPayment(id: string): Promise<PaymentResponseDto>;
    adminConfirmPayment(id: string, confirmDto: AdminConfirmPaymentDto): Promise<PaymentResponseDto>;
}
