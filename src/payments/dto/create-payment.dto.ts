import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentType, PaymentMethod } from '../schemas/payment.schema.js';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(PaymentType)
  @IsNotEmpty()
  type: PaymentType;

  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @IsMongoId()
  @IsOptional()
  referenceId?: string;

  @IsString()
  @IsOptional()
  referenceModel?: 'Match' | 'MonthlyFee' | 'Penalty';

  @IsString()
  @IsOptional()
  description?: string;
}
