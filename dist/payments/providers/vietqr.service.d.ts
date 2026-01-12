import { ConfigService } from '@nestjs/config';
export interface VietQrParams {
    accountNo?: string;
    accountName?: string;
    bankBin?: string;
    amount: number;
    description: string;
    template?: string;
}
export interface VietQrResponse {
    code: string;
    desc: string;
    data: {
        qrCode: string;
        qrDataURL: string;
    };
}
export declare class VietQrService {
    private readonly configService;
    private readonly logger;
    private readonly apiUrl;
    private readonly apiKey?;
    private readonly accountNo;
    private readonly accountName;
    private readonly bankBin;
    constructor(configService: ConfigService);
    generateQrCode(params: Partial<VietQrParams>): Promise<VietQrResponse>;
    generatePaymentCode(paymentId: string): string;
}
