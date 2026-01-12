import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
import { Match } from '../../matches/schemas/match.schema.js';

export enum PenaltyReason {
  LATE_ARRIVAL = 'late_arrival',
  NO_SHOW = 'no_show',
  LATE_CANCELLATION = 'late_cancellation',
  OTHER = 'other',
}

export type PenaltyDocument = HydratedDocument<Penalty> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Penalty {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  match: Match | Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: String, enum: PenaltyReason, required: true })
  reason: PenaltyReason;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  paidAt?: Date;
}

export const PenaltySchema = SchemaFactory.createForClass(Penalty);

// Indexes
PenaltySchema.index({ user: 1, isPaid: 1 });
PenaltySchema.index({ match: 1 });
