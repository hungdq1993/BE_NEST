import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
import { Match } from '../../matches/schemas/match.schema.js';

export type MatchPaymentDocument = HydratedDocument<MatchPayment> & {
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Tiền đóng theo trận - như bảng "BẢNG THU ĐÓNG TIỀN THUA TRẬN"
 * Mỗi record = 1 thành viên đóng tiền cho 1 trận
 */
@Schema({ timestamps: true })
export class MatchPayment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  match: Match | Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  paidAt?: Date;

  @Prop()
  note?: string;
}

export const MatchPaymentSchema = SchemaFactory.createForClass(MatchPayment);

// Unique: 1 user chỉ có 1 payment record cho 1 match
MatchPaymentSchema.index({ user: 1, match: 1 }, { unique: true });
MatchPaymentSchema.index({ match: 1 });
MatchPaymentSchema.index({ isPaid: 1 });
