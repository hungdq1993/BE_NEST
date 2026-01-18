import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';

export type FundBalanceDocument = HydratedDocument<FundBalance> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class FundBalance {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  setBy: User | Types.ObjectId;

  @Prop()
  note?: string;
}

export const FundBalanceSchema = SchemaFactory.createForClass(FundBalance);

// Index for retrieving most recent balance
FundBalanceSchema.index({ createdAt: -1 });
