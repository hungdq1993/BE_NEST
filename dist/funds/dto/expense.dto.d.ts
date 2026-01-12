import { ExpenseCategory } from '../schemas/expense.schema.js';
export declare class CreateExpenseDto {
    description: string;
    amount: number;
    category?: ExpenseCategory;
    matchId?: string;
    date: string;
    note?: string;
}
export declare class UpdateExpenseDto {
    description?: string;
    amount?: number;
    category?: ExpenseCategory;
    matchId?: string;
    date?: string;
    note?: string;
}
export declare class ExpenseResponseDto {
    id: string;
    description: string;
    amount: number;
    category: ExpenseCategory;
    matchId?: string;
    matchDate?: Date;
    date: Date;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class FundSummaryDto {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    incomeBreakdown: {
        matchPayments: number;
        monthlyFees: number;
        penalties: number;
    };
    expenseBreakdown: {
        fieldRental: number;
        drinks: number;
        equipment: number;
        other: number;
    };
}
export declare class MonthlyFundSummaryDto {
    month: number;
    year: number;
    totalIncome: number;
    totalExpense: number;
    balance: number;
    matchCount: number;
}
