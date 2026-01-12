import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';

export type MonthlyFeeDocument = HydratedDocument<MonthlyFee> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class MonthlyFee {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ required: true, min: 1, max: 12 })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  paidAt?: Date;

  @Prop()
  note?: string;
}

export const MonthlyFeeSchema = SchemaFactory.createForClass(MonthlyFee);

// Compound index for unique fee per user per month
MonthlyFeeSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });
MonthlyFeeSchema.index({ isPaid: 1 });
MonthlyFeeSchema.index({ year: 1, month: 1 });
