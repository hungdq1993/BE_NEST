export interface Player {
    id: string;
    name: string;
    skillLevel: number;
}
export interface TeamSplit {
    teamA: Player[];
    teamB: Player[];
    teamASkill: number;
    teamBSkill: number;
    skillDifference: number;
    balanceScore: number;
}
export declare function calculateTeamSkill(players: Player[]): number;
export declare function calculateAverageSkill(players: Player[]): number;
export declare function calculateBalanceScore(teamASkill: number, teamBSkill: number): number;
export declare function splitTeamsGreedy(players: Player[]): TeamSplit;
export declare function isValidSplit(teamA: Player[], teamB: Player[], maxSizeDifference?: number): boolean;
export declare function getSkillDistribution(players: Player[]): {
    min: number;
    max: number;
    average: number;
    median: number;
    total: number;
};
export declare function suggestTeamSize(totalPlayers: number, idealTeamSize?: number): {
    teamASize: number;
    teamBSize: number;
    substitutes: number;
};
