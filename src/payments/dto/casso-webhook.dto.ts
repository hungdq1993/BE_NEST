import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CassoWebhookDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  tid: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  when: string;

  @IsString()
  @IsNotEmpty()
  bank_sub_acc_id: string;

  @IsString()
  @IsOptional()
  subAccId?: string;

  @IsString()
  @IsOptional()
  signature?: string;
}
