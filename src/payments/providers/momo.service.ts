import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

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

@Injectable()
export class MomoService {
  private readonly partnerCode: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly momoUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE', '');
    this.accessKey = this.configService.get<string>('MOMO_ACCESS_KEY', '');
    this.secretKey = this.configService.get<string>('MOMO_SECRET_KEY', '');
    this.momoUrl = this.configService.get<string>(
      'MOMO_URL',
      'https://test-payment.momo.vn/v2/gateway/api/create',
    );
  }

  async createPaymentUrl(params: MomoPaymentParams): Promise<string> {
    const requestId = `${params.orderId}_${Date.now()}`;
    const requestType = 'captureWallet';
    const extraData = '';

    const rawSignature = [
      `accessKey=${this.accessKey}`,
      `amount=${params.amount}`,
      `extraData=${extraData}`,
      `ipnUrl=${params.notifyUrl}`,
      `orderId=${params.orderId}`,
      `orderInfo=${params.orderInfo}`,
      `partnerCode=${this.partnerCode}`,
      `redirectUrl=${params.returnUrl}`,
      `requestId=${requestId}`,
      `requestType=${requestType}`,
    ].join('&');

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    // Request body prepared for production use with MoMo API
    // In production, uncomment and use axios:
    // const response = await axios.post(this.momoUrl, {
    //   partnerCode: this.partnerCode,
    //   accessKey: this.accessKey,
    //   requestId,
    //   amount: params.amount,
    //   orderId: params.orderId,
    //   orderInfo: params.orderInfo,
    //   redirectUrl: params.returnUrl,
    //   ipnUrl: params.notifyUrl,
    //   extraData,
    //   requestType,
    //   signature,
    //   lang: 'vi',
    // });
    // return response.data.payUrl;

    // Log signature for debugging (remove in production)
    void signature;

    // Placeholder for development
    return `${this.momoUrl}?orderId=${params.orderId}`;
  }

  verifyCallback(params: Record<string, string>): MomoVerifyResult {
    const signature = params['signature'];
    const rawSignature = [
      `accessKey=${this.accessKey}`,
      `amount=${params['amount']}`,
      `extraData=${params['extraData'] || ''}`,
      `message=${params['message']}`,
      `orderId=${params['orderId']}`,
      `orderInfo=${params['orderInfo']}`,
      `orderType=${params['orderType']}`,
      `partnerCode=${this.partnerCode}`,
      `payType=${params['payType']}`,
      `requestId=${params['requestId']}`,
      `responseTime=${params['responseTime']}`,
      `resultCode=${params['resultCode']}`,
      `transId=${params['transId']}`,
    ].join('&');

    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    return {
      isValid: signature === expectedSignature,
      resultCode: params['resultCode'],
      transId: params['transId'],
    };
  }
}
