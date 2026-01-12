import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';

export enum VoteStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export type VoteSessionDocument = HydratedDocument<VoteSession> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class VoteSession {
  @Prop({ required: true })
  matchDate: Date;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ type: String, enum: VoteStatus, default: VoteStatus.OPEN })
  status: VoteStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User | Types.ObjectId;

  @Prop()
  description?: string;

  @Prop()
  location?: string;
}

export const VoteSessionSchema = SchemaFactory.createForClass(VoteSession);

// Index for faster lookups by status and date
VoteSessionSchema.index({ status: 1, matchDate: 1 });
VoteSessionSchema.index({ createdBy: 1 });
