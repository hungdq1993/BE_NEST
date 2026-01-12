import { MatchesService } from './matches.service.js';
import { CreateMatchDto } from './dto/create-match.dto.js';
import { UpdateMatchResultDto } from './dto/update-match-result.dto.js';
import { SplitTeamDto } from './dto/split-team.dto.js';
import { MatchResponseDto, MatchWithLineupsDto } from './dto/team-lineup.dto.js';
import { MatchStatus } from './schemas/match.schema.js';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    createMatch(createDto: CreateMatchDto): Promise<MatchResponseDto>;
    findAllMatches(status?: MatchStatus): Promise<MatchResponseDto[]>;
    findMatch(id: string): Promise<MatchWithLineupsDto>;
    updateResult(id: string, updateDto: UpdateMatchResultDto): Promise<MatchResponseDto>;
    cancelMatch(id: string): Promise<MatchResponseDto>;
    deleteMatch(id: string): Promise<void>;
    splitTeams(id: string, splitDto: SplitTeamDto): Promise<MatchWithLineupsDto>;
    findMatchHistoryByUser(userId: string): Promise<{
        id: string;
        matchDate: Date;
        location: string;
        status: string;
        team: 'A' | 'B';
        result?: {
            teamAScore: number;
            teamBScore: number;
        };
        isWinner?: boolean;
    }[]>;
}
