export declare class CreateMatchPaymentDto {
    userId: string;
    matchId: string;
    amount: number;
    isPaid?: boolean;
    note?: string;
}
export declare class BulkCreateMatchPaymentDto {
    matchId: string;
    players: PlayerPaymentDto[];
}
export declare class PlayerPaymentDto {
    userId: string;
    amount: number;
    isPaid?: boolean;
}
export declare class MatchPaymentResponseDto {
    id: string;
    userId: string;
    userName?: string;
    matchId: string;
    matchDate?: Date;
    amount: number;
    isPaid: boolean;
    paidAt?: Date;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class MatchPaymentSummaryDto {
    matchId: string;
    matchDate: Date;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    playerCount: number;
    paidCount: number;
    payments: MatchPaymentResponseDto[];
}
export declare class MemberPaymentSummaryDto {
    userId: string;
    userName: string;
    totalMatches: number;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    payments: {
        matchId: string;
        matchDate: Date;
        amount: number;
        isPaid: boolean;
    }[];
}
export declare class MatchDetailWithPaymentsDto {
    matchId: string;
    matchDate: Date;
    location: string;
    status: string;
    matchFee: number;
    result?: {
        teamAScore: number;
        teamBScore: number;
    };
    winningTeam?: 'A' | 'B' | 'DRAW';
    teamA?: {
        id: string;
        players: Array<{
            id: string;
            name: string;
            skillLevel: number;
            payment?: {
                id: string;
                amount: number;
                isPaid: boolean;
                paidAt?: Date;
            };
        }>;
        totalSkillLevel: number;
    };
    teamB?: {
        id: string;
        players: Array<{
            id: string;
            name: string;
            skillLevel: number;
            payment?: {
                id: string;
                amount: number;
                isPaid: boolean;
                paidAt?: Date;
            };
        }>;
        totalSkillLevel: number;
    };
    losingTeamPlayers?: Array<{
        userId: string;
        userName: string;
        amount: number;
        isPaid: boolean;
    }>;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
