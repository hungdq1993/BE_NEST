import { VotesService } from './votes.service.js';
import { CreateVoteSessionDto } from './dto/create-vote-session.dto.js';
import { SubmitVoteDto } from './dto/submit-vote.dto.js';
import { VoteStatsDto, VoteSessionResponseDto, VoteResponseDto } from './dto/vote-stats.dto.js';
export declare class VotesController {
    private readonly votesService;
    constructor(votesService: VotesService);
    createSession(createDto: CreateVoteSessionDto, user: any): Promise<VoteSessionResponseDto>;
    findAllSessions(): Promise<VoteSessionResponseDto[]>;
    findOpenSessions(): Promise<VoteSessionResponseDto[]>;
    findSession(id: string): Promise<VoteSessionResponseDto>;
    getSessionStats(id: string): Promise<VoteStatsDto>;
    closeSession(id: string): Promise<VoteSessionResponseDto>;
    cancelSession(id: string): Promise<VoteSessionResponseDto>;
    deleteSession(id: string): Promise<void>;
    submitVote(submitDto: SubmitVoteDto, user: any): Promise<VoteResponseDto>;
    getMyVote(id: string, user: any): Promise<VoteResponseDto | null>;
}
