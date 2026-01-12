import { Model } from 'mongoose';
import { VoteSessionDocument, VoteStatus } from './schemas/vote-session.schema.js';
import { VoteResponseDocument, VoteChoice } from './schemas/vote-response.schema.js';
import { CreateVoteSessionDto } from './dto/create-vote-session.dto.js';
export declare class VotesRepository {
    private readonly voteSessionModel;
    private readonly voteResponseModel;
    constructor(voteSessionModel: Model<VoteSessionDocument>, voteResponseModel: Model<VoteResponseDocument>);
    createSession(createDto: CreateVoteSessionDto, createdBy: string): Promise<VoteSessionDocument>;
    findAllSessions(): Promise<VoteSessionDocument[]>;
    findSessionById(id: string): Promise<VoteSessionDocument | null>;
    findOpenSessions(): Promise<VoteSessionDocument[]>;
    updateSessionStatus(id: string, status: VoteStatus): Promise<VoteSessionDocument | null>;
    deleteSession(id: string): Promise<VoteSessionDocument | null>;
    submitVote(sessionId: string, userId: string, choice: VoteChoice, note?: string): Promise<VoteResponseDocument>;
    findVotesBySession(sessionId: string): Promise<VoteResponseDocument[]>;
    findUserVote(sessionId: string, userId: string): Promise<VoteResponseDocument | null>;
    countVotesByChoice(sessionId: string): Promise<{
        choice: VoteChoice;
        count: number;
    }[]>;
    deleteVotesBySession(sessionId: string): Promise<void>;
}
