import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
import { VoteSession } from './vote-session.schema.js';

export enum VoteChoice {
  YES = 'yes',
  NO = 'no',
  MAYBE = 'maybe',
}

export type VoteResponseDocument = HydratedDocument<VoteResponse> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class VoteResponse {
  @Prop({ type: Types.ObjectId, ref: 'VoteSession', required: true })
  session: VoteSession | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;

  @Prop({ type: String, enum: VoteChoice, required: true })
  choice: VoteChoice;

  @Prop()
  note?: string;
}

export const VoteResponseSchema = SchemaFactory.createForClass(VoteResponse);

// Compound index to ensure one vote per user per session
VoteResponseSchema.index({ session: 1, user: 1 }, { unique: true });
VoteResponseSchema.index({ session: 1, choice: 1 });
