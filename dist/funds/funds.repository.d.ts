import { Model } from 'mongoose';
import { MonthlyFeeDocument } from './schemas/monthly-fee.schema.js';
import { PenaltyDocument } from './schemas/penalty.schema.js';
import { MatchPaymentDocument } from './schemas/match-payment.schema.js';
import { ExpenseDocument } from './schemas/expense.schema.js';
import { CreateMonthlyFeeDto, CreatePenaltyDto, BulkCreateMonthlyFeeDto } from './dto/fund-stats.dto.js';
import { CreateMatchPaymentDto, BulkCreateMatchPaymentDto } from './dto/match-payment.dto.js';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto.js';
export declare class FundsRepository {
    private readonly monthlyFeeModel;
    private readonly penaltyModel;
    private readonly matchPaymentModel;
    private readonly expenseModel;
    constructor(monthlyFeeModel: Model<MonthlyFeeDocument>, penaltyModel: Model<PenaltyDocument>, matchPaymentModel: Model<MatchPaymentDocument>, expenseModel: Model<ExpenseDocument>);
    createMatchPayment(dto: CreateMatchPaymentDto): Promise<MatchPaymentDocument>;
    bulkCreateMatchPayments(dto: BulkCreateMatchPaymentDto): Promise<MatchPaymentDocument[]>;
    findMatchPaymentsByMatch(matchId: string): Promise<MatchPaymentDocument[]>;
    findMatchPaymentsByUser(userId: string): Promise<MatchPaymentDocument[]>;
    findAllMatchPayments(): Promise<MatchPaymentDocument[]>;
    findUnpaidMatchPayments(): Promise<MatchPaymentDocument[]>;
    markMatchPaymentPaid(id: string): Promise<MatchPaymentDocument | null>;
    deleteMatchPayment(id: string): Promise<MatchPaymentDocument | null>;
    getMatchPaymentStats(): Promise<{
        total: number;
        paid: number;
        unpaid: number;
    }>;
    createExpense(dto: CreateExpenseDto): Promise<ExpenseDocument>;
    findAllExpenses(startDate?: string, endDate?: string, category?: string): Promise<ExpenseDocument[]>;
    findExpensesByDateRange(startDate: Date, endDate: Date): Promise<ExpenseDocument[]>;
    findExpensesByMatch(matchId: string): Promise<ExpenseDocument[]>;
    updateExpense(id: string, dto: UpdateExpenseDto): Promise<ExpenseDocument | null>;
    deleteExpense(id: string): Promise<ExpenseDocument | null>;
    getExpenseStats(): Promise<{
        total: number;
        byCategory: {
            category: string;
            amount: number;
        }[];
    }>;
    createMonthlyFee(dto: CreateMonthlyFeeDto): Promise<MonthlyFeeDocument>;
    bulkCreateMonthlyFees(dto: BulkCreateMonthlyFeeDto, userIds: string[]): Promise<MonthlyFeeDocument[]>;
    findAllMonthlyFees(): Promise<MonthlyFeeDocument[]>;
    findMonthlyFeesByUser(userId: string): Promise<MonthlyFeeDocument[]>;
    findMonthlyFeesByPeriod(month: number, year: number): Promise<MonthlyFeeDocument[]>;
    findUnpaidMonthlyFees(): Promise<MonthlyFeeDocument[]>;
    findUnpaidMonthlyFeesByYear(year: number): Promise<MonthlyFeeDocument[]>;
    markMonthlyFeePaid(id: string): Promise<MonthlyFeeDocument | null>;
    createAndPayMonthlyFee(dto: CreateMonthlyFeeDto): Promise<MonthlyFeeDocument>;
    deleteMonthlyFee(id: string): Promise<MonthlyFeeDocument | null>;
    createPenalty(dto: CreatePenaltyDto): Promise<PenaltyDocument>;
    findAllPenalties(): Promise<PenaltyDocument[]>;
    findPenaltiesByUser(userId: string): Promise<PenaltyDocument[]>;
    findPenaltiesByMatch(matchId: string): Promise<PenaltyDocument[]>;
    findUnpaidPenalties(): Promise<PenaltyDocument[]>;
    markPenaltyPaid(id: string): Promise<PenaltyDocument | null>;
    deletePenalty(id: string): Promise<PenaltyDocument | null>;
    getMonthlyFeeStats(): Promise<{
        _id: {
            month: number;
            year: number;
        };
        collected: number;
        pending: number;
        paidCount: number;
        unpaidCount: number;
    }[]>;
    getPenaltyStats(): Promise<{
        totalPenalties: number;
        collectedPenalties: number;
        pendingPenalties: number;
    }>;
    getUserFundSummary(userId: string): Promise<{
        monthlyFees: {
            total: number;
            paid: number;
            pending: number;
        };
        penalties: {
            total: number;
            paid: number;
            pending: number;
        };
        matchPayments: {
            total: number;
            paid: number;
            pending: number;
        };
    }>;
    getUserDebtDetail(userId: string): Promise<{
        unpaidMonthlyFees: MonthlyFeeDocument[];
        unpaidMatchPayments: MatchPaymentDocument[];
        unpaidPenalties: PenaltyDocument[];
    }>;
    getFundSummary(): Promise<{
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
    }>;
}
