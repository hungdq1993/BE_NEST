import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';

export enum PaymentType {
  MATCH_FEE = 'match_fee',
  MONTHLY_FEE = 'monthly_fee',
  PENALTY = 'penalty',
  OTHER = 'other',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  VNPAY = 'vnpay',
  MOMO = 'momo',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

export type PaymentDocument = HydratedDocument<Payment> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: String, enum: PaymentType, required: true })
  type: PaymentType;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ type: String, enum: PaymentMethod })
  method?: PaymentMethod;

  @Prop()
  transactionId?: string;

  @Prop({ type: Types.ObjectId, refPath: 'referenceModel' })
  reference?: Types.ObjectId;

  @Prop({ type: String, enum: ['Match', 'MonthlyFee', 'Penalty'] })
  referenceModel?: string;

  @Prop()
  description?: string;

  @Prop()
  paidAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes
PaymentSchema.index({ user: 1, status: 1 });
PaymentSchema.index({ transactionId: 1 }, { sparse: true });
PaymentSchema.index({ type: 1, status: 1 });
