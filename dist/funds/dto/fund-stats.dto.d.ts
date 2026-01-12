export declare class MonthlyFeeResponseDto {
    id: string;
    userId: string;
    userName?: string;
    month: number;
    year: number;
    amount: number;
    isPaid: boolean;
    paidAt?: Date;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class FundStatsDto {
    totalCollected: number;
    totalPending: number;
    monthlyFeeStats: {
        month: number;
        year: number;
        collected: number;
        pending: number;
        paidCount: number;
        unpaidCount: number;
    }[];
    penaltyStats: {
        totalPenalties: number;
        collectedPenalties: number;
        pendingPenalties: number;
    };
}
export declare class UserFundSummaryDto {
    userId: string;
    userName: string;
    totalMonthlyFees: number;
    paidMonthlyFees: number;
    pendingMonthlyFees: number;
    totalPenalties: number;
    paidPenalties: number;
    pendingPenalties: number;
    totalMatchPayments: number;
    paidMatchPayments: number;
    pendingMatchPayments: number;
    totalOwed: number;
    totalPaid: number;
}
export declare class UserDebtDetailDto {
    userId: string;
    userName: string;
    totalOwed: number;
    totalPaid: number;
    unpaidMonthlyFees: {
        id: string;
        month: number;
        year: number;
        amount: number;
        note?: string;
        createdAt: Date;
    }[];
    unpaidMatchPayments: {
        id: string;
        matchId: string;
        matchDate?: Date;
        matchLocation?: string;
        amount: number;
        note?: string;
        createdAt: Date;
    }[];
    unpaidPenalties: {
        id: string;
        matchId: string;
        matchDate?: Date;
        reason: string;
        description?: string;
        amount: number;
        createdAt: Date;
    }[];
}
export declare class CreateMonthlyFeeDto {
    userId: string;
    month: number;
    year: number;
    amount: number;
    note?: string;
}
export declare class CreateAndPayMonthlyFeeDto {
    userId: string;
    month: number;
    year: number;
    amount: number;
    note?: string;
}
export declare class CreatePenaltyDto {
    userId: string;
    matchId: string;
    amount: number;
    reason: string;
    description?: string;
}
export declare class BulkCreateMonthlyFeeDto {
    month: number;
    year: number;
    amount: number;
    note?: string;
}
export declare class MonthlyFeePeriodStatusDto {
    month: number;
    year: number;
    totalUsers: number;
    paidUsers: {
        userId: string;
        userName: string;
        feeId: string;
        amount: number;
        paidAt: Date;
    }[];
    unpaidUsers: {
        userId: string;
        userName: string;
        feeId?: string;
        amount: number;
    }[];
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    totalUnpaidAllMonths: number;
}
export declare class UserStatisticsItemDto {
    userId: string;
    userName: string;
    email?: string;
    role: string;
    skillLevel: number;
    isActive: boolean;
    totalOwed: number;
    totalPaid: number;
    pendingMonthlyFees: number;
    pendingPenalties: number;
    pendingMatchPayments: number;
    losingMatchesCount: number;
    totalMonthlyFees: number;
    paidMonthlyFees: number;
    unpaidMonthlyFees: number;
    totalPenalties: number;
    paidPenalties: number;
    unpaidPenalties: number;
    totalMatchPayments: number;
    paidMatchPayments: number;
    unpaidMatchPayments: number;
}
export declare class UsersStatisticsDto {
    totalUsers: number;
    users: UserStatisticsItemDto[];
    summary: {
        totalOwed: number;
        totalPaid: number;
        totalPendingMonthlyFees: number;
        totalPendingPenalties: number;
        totalPendingMatchPayments: number;
    };
}
export declare class DebtItemDto {
    id: string;
    type: 'MONTHLY_FEE' | 'PENALTY' | 'MATCH_PAYMENT';
    userId: string;
    userName: string;
    amount: number;
    createdAt: Date;
    month?: number;
    year?: number;
    note?: string;
    matchId?: string;
    matchDate?: Date;
    reason?: string;
    description?: string;
    matchLocation?: string;
}
export declare class AllDebtsDto {
    totalDebts: number;
    totalAmount: number;
    debts: DebtItemDto[];
    summary: {
        monthlyFeesCount: number;
        monthlyFeesAmount: number;
        penaltiesCount: number;
        penaltiesAmount: number;
        matchPaymentsCount: number;
        matchPaymentsAmount: number;
    };
}
