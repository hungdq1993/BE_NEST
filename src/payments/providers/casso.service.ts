import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface CassoWebhookData {
  id: number; // Casso transaction ID
  tid: string; // Bank transaction ID
  description: string; // Transfer description
  amount: number;
  when: string; // ISO timestamp
  bank_sub_acc_id: string;
  subAccId?: string;
}

export interface CassoVerifyResult {
  isValid: boolean;
  paymentId: string | null;
  transactionId: string;
  amount: number;
}

@Injectable()
export class CassoService {
  private readonly secureToken: string;

  constructor(private readonly configService: ConfigService) {
    this.secureToken = this.configService.get<string>('CASSO_SECURE_TOKEN', '');
  }

  verifyWebhook(data: CassoWebhookData, signature?: string): CassoVerifyResult {
    // Signature verification
    let isValid = true;

    if (signature && this.secureToken) {
      const rawData = JSON.stringify(data);
      const expectedSignature = crypto
        .createHmac('sha256', this.secureToken)
        .update(rawData)
        .digest('hex');

      isValid = signature === expectedSignature;
    }

    // Extract payment ID from description
    const paymentId = this.extractPaymentId(data.description);

    return {
      isValid,
      paymentId,
      transactionId: data.tid,
      amount: data.amount,
    };
  }

  private extractPaymentId(description: string): string | null {
    // Extract PAY_xxxxx pattern
    const match = description.match(/PAY_([a-f0-9]{24})/i);
    return match ? match[1] : null;
  }

  generatePaymentCode(paymentId: string): string {
    return `PAY_${paymentId}`;
  }
}
