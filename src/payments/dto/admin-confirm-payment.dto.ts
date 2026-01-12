import { IsOptional, IsString } from 'class-validator';

export class AdminConfirmPaymentDto {
  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
