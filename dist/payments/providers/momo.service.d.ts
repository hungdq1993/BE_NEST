import { ConfigService } from '@nestjs/config';
export interface MomoPaymentParams {
    orderId: string;
    amount: number;
    orderInfo: string;
    returnUrl: string;
    notifyUrl: string;
}
export interface MomoVerifyResult {
    isValid: boolean;
    resultCode: string;
    transId: string;
}
export declare class MomoService {
    private readonly configService;
    private readonly partnerCode;
    private readonly accessKey;
    private readonly secretKey;
    private readonly momoUrl;
    constructor(configService: ConfigService);
    createPaymentUrl(params: MomoPaymentParams): Promise<string>;
    verifyCallback(params: Record<string, string>): MomoVerifyResult;
}
