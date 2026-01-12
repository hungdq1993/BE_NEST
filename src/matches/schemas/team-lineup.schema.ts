import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Match } from './match.schema.js';
import { User } from '../../users/schemas/user.schema.js';

export type TeamLineupDocument = HydratedDocument<TeamLineup> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class TeamLineup {
  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  match: Match | Types.ObjectId;

  @Prop({ type: String, enum: ['A', 'B'], required: true })
  team: 'A' | 'B';

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  players: (User | Types.ObjectId)[];

  @Prop({ type: Number })
  totalSkillLevel: number;
}

export const TeamLineupSchema = SchemaFactory.createForClass(TeamLineup);

// Compound index for match and team
TeamLineupSchema.index({ match: 1, team: 1 }, { unique: true });
