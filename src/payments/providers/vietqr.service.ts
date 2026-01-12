import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
    qrCode: string; // base64 image
    qrDataURL: string; // data URL for direct display
  };
}

@Injectable()
export class VietQrService {
  private readonly logger = new Logger(VietQrService.name);
  private readonly apiUrl: string;
  private readonly apiKey?: string;
  private readonly accountNo: string;
  private readonly accountName: string;
  private readonly bankBin: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>(
      'VIETQR_API_URL',
      'https://api.vietqr.io/v2/generate',
    );
    this.apiKey = this.configService.get<string>('VIETQR_API_KEY', '');
    this.accountNo = this.configService.get<string>('BANK_ACCOUNT_NO', '');
    this.accountName = this.configService.get<string>('BANK_ACCOUNT_NAME', '');
    this.bankBin = this.configService.get<string>('BANK_BIN', '');
  }

  async generateQrCode(params: Partial<VietQrParams>): Promise<VietQrResponse> {
    const requestBody = {
      accountNo: params.accountNo || this.accountNo,
      accountName: params.accountName || this.accountName,
      acqId: params.bankBin || this.bankBin,
      amount: params.amount,
      addInfo: params.description,
      format: 'text',
      template: params.template || 'compact',
    };

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey;
      headers['x-client-id'] = this.apiKey;
    }

    try {
      const response = await axios.post<VietQrResponse>(
        this.apiUrl,
        requestBody,
        { headers },
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(
        'VietQR API error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  generatePaymentCode(paymentId: string): string {
    return `PAY_${paymentId}`;
  }
}
