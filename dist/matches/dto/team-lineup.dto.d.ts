import { MatchStatus } from '../schemas/match.schema.js';
export declare class PlayerDto {
    id: string;
    name: string;
    skillLevel: number;
}
export declare class TeamLineupResponseDto {
    id: string;
    matchId: string;
    team: 'A' | 'B';
    players: PlayerDto[];
    totalSkillLevel: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MatchResponseDto {
    id: string;
    matchDate: Date;
    location: string;
    status: MatchStatus;
    voteSessionId?: string;
    result?: {
        teamAScore: number;
        teamBScore: number;
    };
    matchFee: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MatchWithLineupsDto extends MatchResponseDto {
    teamA?: TeamLineupResponseDto;
    teamB?: TeamLineupResponseDto;
}
