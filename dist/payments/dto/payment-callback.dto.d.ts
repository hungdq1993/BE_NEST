export declare class VnpayCallbackDto {
    vnp_TxnRef: string;
    vnp_ResponseCode: string;
    vnp_TransactionNo: string;
    vnp_SecureHash?: string;
    vnp_Amount?: string;
    vnp_BankCode?: string;
    vnp_PayDate?: string;
}
export declare class MomoCallbackDto {
    orderId: string;
    resultCode: string;
    transId: string;
    signature?: string;
    amount?: string;
    message?: string;
}
export { CassoWebhookDto } from './casso-webhook.dto.js';
