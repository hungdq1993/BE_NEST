import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ExpenseCategory } from '../schemas/expense.schema.js';

export class CreateExpenseDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @IsString()
  @IsOptional()
  matchId?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateExpenseDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @IsString()
  @IsOptional()
  matchId?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  note?: string;
}

export class ExpenseResponseDto {
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

// Bảng tổng hợp Thu-Chi
export class FundSummaryDto {
  totalIncome: number; // Tổng thu (tiền đóng trận + tiền tháng + tiền phạt)
  totalExpense: number; // Tổng chi
  balance: number; // Chênh lệch (Thu - Chi)

  incomeBreakdown: {
    matchPayments: number; // Tiền đóng theo trận
    monthlyFees: number; // Tiền tháng
    penalties: number; // Tiền phạt
  };

  expenseBreakdown: {
    fieldRental: number; // Tiền sân
    drinks: number; // Nước uống
    equipment: number; // Dụng cụ
    other: number; // Khác
  };
}

// Thống kê theo tháng
export class MonthlyFundSummaryDto {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  matchCount: number;
}
