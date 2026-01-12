import { ConfigService } from '@nestjs/config';
export interface CassoWebhookData {
    id: number;
    tid: string;
    description: string;
    amount: number;
    when: string;
    bank_sub_acc_id: string;
    subAccId?: string;
}
export interface CassoVerifyResult {
    isValid: boolean;
    paymentId: string | null;
    transactionId: string;
    amount: number;
}
export declare class CassoService {
    private readonly configService;
    private readonly secureToken;
    constructor(configService: ConfigService);
    verifyWebhook(data: CassoWebhookData, signature?: string): CassoVerifyResult;
    private extractPaymentId;
    generatePaymentCode(paymentId: string): string;
}
