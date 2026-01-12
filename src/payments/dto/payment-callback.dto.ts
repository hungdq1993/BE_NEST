import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VnpayCallbackDto {
  @IsString()
  @IsNotEmpty()
  vnp_TxnRef: string;

  @IsString()
  @IsNotEmpty()
  vnp_ResponseCode: string;

  @IsString()
  @IsNotEmpty()
  vnp_TransactionNo: string;

  @IsString()
  @IsOptional()
  vnp_SecureHash?: string;

  @IsString()
  @IsOptional()
  vnp_Amount?: string;

  @IsString()
  @IsOptional()
  vnp_BankCode?: string;

  @IsString()
  @IsOptional()
  vnp_PayDate?: string;
}

export class MomoCallbackDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  resultCode: string;

  @IsString()
  @IsNotEmpty()
  transId: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsString()
  @IsOptional()
  amount?: string;

  @IsString()
  @IsOptional()
  message?: string;
}

export { CassoWebhookDto } from './casso-webhook.dto.js';
