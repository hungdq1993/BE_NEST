import { Model } from 'mongoose';
import { MatchDocument, MatchStatus } from './schemas/match.schema.js';
import { TeamLineupDocument } from './schemas/team-lineup.schema.js';
import { CreateMatchDto } from './dto/create-match.dto.js';
export declare class MatchesRepository {
    private readonly matchModel;
    private readonly teamLineupModel;
    constructor(matchModel: Model<MatchDocument>, teamLineupModel: Model<TeamLineupDocument>);
    createMatch(createDto: CreateMatchDto): Promise<MatchDocument>;
    findAllMatches(): Promise<MatchDocument[]>;
    findMatchById(id: string): Promise<MatchDocument | null>;
    findMatchesByStatus(status: MatchStatus): Promise<MatchDocument[]>;
    updateMatchStatus(id: string, status: MatchStatus): Promise<MatchDocument | null>;
    updateMatchResult(id: string, result: {
        teamAScore: number;
        teamBScore: number;
    }, notes?: string): Promise<MatchDocument | null>;
    deleteMatch(id: string): Promise<MatchDocument | null>;
    createTeamLineup(matchId: string, team: 'A' | 'B', playerIds: string[], totalSkillLevel: number): Promise<TeamLineupDocument>;
    findLineupsByMatch(matchId: string): Promise<TeamLineupDocument[]>;
    findLineupByMatchAndTeam(matchId: string, team: 'A' | 'B'): Promise<TeamLineupDocument | null>;
    deleteLineupsByMatch(matchId: string): Promise<void>;
    updateLineup(matchId: string, team: 'A' | 'B', playerIds: string[], totalSkillLevel: number): Promise<TeamLineupDocument | null>;
    findMatchesByUser(userId: string): Promise<MatchDocument[]>;
    findMatchHistoryByUser(userId: string): Promise<{
        match: MatchDocument;
        team: 'A' | 'B';
    }[]>;
}
