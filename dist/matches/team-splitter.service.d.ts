export interface PlayerWithSkill {
    id: string;
    name: string;
    skillLevel: number;
}
export interface SplitResult {
    teamA: PlayerWithSkill[];
    teamB: PlayerWithSkill[];
    teamASkill: number;
    teamBSkill: number;
    skillDifference: number;
}
export declare class TeamSplitterService {
    splitTeams(players: PlayerWithSkill[]): SplitResult;
    calculateTeamSkill(players: PlayerWithSkill[]): number;
}
