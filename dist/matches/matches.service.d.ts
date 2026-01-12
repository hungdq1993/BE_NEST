import { MatchesRepository } from './matches.repository.js';
import { TeamSplitterService } from './team-splitter.service.js';
import { CreateMatchDto } from './dto/create-match.dto.js';
import { UpdateMatchResultDto } from './dto/update-match-result.dto.js';
import { SplitTeamDto } from './dto/split-team.dto.js';
import { MatchResponseDto, MatchWithLineupsDto } from './dto/team-lineup.dto.js';
import { MatchStatus } from './schemas/match.schema.js';
import { UsersService } from '../users/users.service.js';
import { FundsService } from '../funds/funds.service.js';
export declare class MatchesService {
    private readonly matchesRepository;
    private readonly teamSplitterService;
    private readonly usersService;
    private readonly fundsService;
    constructor(matchesRepository: MatchesRepository, teamSplitterService: TeamSplitterService, usersService: UsersService, fundsService: FundsService);
    createMatch(createDto: CreateMatchDto): Promise<MatchResponseDto>;
    findAllMatches(): Promise<MatchResponseDto[]>;
    findMatchById(id: string): Promise<MatchWithLineupsDto>;
    findMatchesByStatus(status: MatchStatus): Promise<MatchResponseDto[]>;
    updateMatchResult(id: string, updateDto: UpdateMatchResultDto): Promise<MatchResponseDto>;
    cancelMatch(id: string): Promise<MatchResponseDto>;
    deleteMatch(id: string): Promise<void>;
    splitTeams(matchId: string, splitDto: SplitTeamDto): Promise<MatchWithLineupsDto>;
    private toMatchResponseDto;
    private toTeamLineupResponseDto;
    private toMatchWithLineupsDto;
    findMatchHistoryByUser(userId: string): Promise<{
        id: string;
        matchDate: Date;
        location: string;
        status: MatchStatus;
        team: 'A' | 'B';
        result?: {
            teamAScore: number;
            teamBScore: number;
        };
        isWinner?: boolean;
    }[]>;
}
