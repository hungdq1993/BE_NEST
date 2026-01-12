import { VoteChoice } from '../schemas/vote-response.schema.js';

export class VoteStatsDto {
  sessionId: string;
  matchDate: Date;
  deadline: Date;
  status: string;
  totalVotes: number;
  yesCount: number;
  noCount: number;
  maybeCount: number;
  voters: VoterDto[];
}

export class VoterDto {
  userId: string;
  userName: string;
  choice: VoteChoice;
  votedAt: Date;
}

export class VoteSessionResponseDto {
  id: string;
  matchDate: Date;
  deadline: Date;
  status: string;
  description?: string;
  location?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class VoteResponseDto {
  id: string;
  sessionId: string;
  userId: string;
  choice: VoteChoice;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
