import { PenaltyReason } from '../schemas/penalty.schema.js';
export declare class PenaltyResponseDto {
    id: string;
    userId: string;
    userName?: string;
    matchId: string;
    matchDate?: Date;
    amount: number;
    reason: PenaltyReason;
    description?: string;
    isPaid: boolean;
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PenaltySummaryDto {
    userId: string;
    userName: string;
    totalPenalties: number;
    paidAmount: number;
    pendingAmount: number;
    penaltyCount: number;
    penalties: PenaltyResponseDto[];
}
export declare class PenaltyByReasonDto {
    reason: PenaltyReason;
    count: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
}
