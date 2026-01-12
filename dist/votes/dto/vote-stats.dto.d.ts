import { VoteChoice } from '../schemas/vote-response.schema.js';
export declare class VoteStatsDto {
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
export declare class VoterDto {
    userId: string;
    userName: string;
    choice: VoteChoice;
    votedAt: Date;
}
export declare class VoteSessionResponseDto {
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
export declare class VoteResponseDto {
    id: string;
    sessionId: string;
    userId: string;
    choice: VoteChoice;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
