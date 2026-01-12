import { VotesRepository } from './votes.repository.js';
import { CreateVoteSessionDto } from './dto/create-vote-session.dto.js';
import { SubmitVoteDto } from './dto/submit-vote.dto.js';
import { VoteStatsDto, VoteSessionResponseDto, VoteResponseDto } from './dto/vote-stats.dto.js';
export declare class VotesService {
    private readonly votesRepository;
    constructor(votesRepository: VotesRepository);
    createSession(createDto: CreateVoteSessionDto, userId: string): Promise<VoteSessionResponseDto>;
    findAllSessions(): Promise<VoteSessionResponseDto[]>;
    findOpenSessions(): Promise<VoteSessionResponseDto[]>;
    findSessionById(id: string): Promise<VoteSessionResponseDto>;
    closeSession(id: string): Promise<VoteSessionResponseDto>;
    cancelSession(id: string): Promise<VoteSessionResponseDto>;
    deleteSession(id: string): Promise<void>;
    submitVote(submitDto: SubmitVoteDto, userId: string): Promise<VoteResponseDto>;
    getSessionStats(sessionId: string): Promise<VoteStatsDto>;
    getUserVote(sessionId: string, userId: string): Promise<VoteResponseDto | null>;
    private toSessionResponseDto;
    private toVoteResponseDto;
}
