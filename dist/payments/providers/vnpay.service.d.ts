import { ConfigService } from '@nestjs/config';
export interface VnpayPaymentParams {
    orderId: string;
    amount: number;
    orderInfo: string;
    returnUrl: string;
    ipAddr: string;
}
export interface VnpayVerifyResult {
    isValid: boolean;
    responseCode: string;
    transactionNo: string;
}
export declare class VnpayService {
    private readonly configService;
    private readonly tmnCode;
    private readonly secretKey;
    private readonly vnpUrl;
    constructor(configService: ConfigService);
    createPaymentUrl(params: VnpayPaymentParams): string;
    verifyCallback(params: Record<string, string>): VnpayVerifyResult;
    private sortObject;
    private formatDate;
}
