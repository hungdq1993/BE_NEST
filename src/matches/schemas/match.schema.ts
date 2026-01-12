import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { VoteSession } from '../../votes/schemas/vote-session.schema.js';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type MatchDocument = HydratedDocument<Match> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true })
  matchDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ type: String, enum: MatchStatus, default: MatchStatus.SCHEDULED })
  status: MatchStatus;

  @Prop({ type: Types.ObjectId, ref: 'VoteSession' })
  voteSession?: VoteSession | Types.ObjectId;

  @Prop({ type: Object })
  result?: {
    teamAScore: number;
    teamBScore: number;
  };

  @Prop({ type: Number, default: 0 })
  matchFee: number;

  @Prop()
  notes?: string;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

// Index for faster lookups
MatchSchema.index({ matchDate: -1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ voteSession: 1 });
