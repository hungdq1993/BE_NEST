import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory } from '../schemas/expense.schema.js';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Mô tả chi phí',
    example: 'Thuê sân bóng',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Số tiền (VNĐ)',
    example: 500000,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Danh mục chi phí',
    enum: ExpenseCategory,
    example: ExpenseCategory.FIELD_RENTAL,
  })
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @ApiPropertyOptional({
    description: 'Match ID (nếu chi phí liên quan đến trận đấu)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsOptional()
  matchId?: string;

  @ApiProperty({
    description: 'Ngày chi phí (ISO 8601)',
    example: '2025-01-15',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Thuê sân 2 tiếng',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateExpenseDto {
  @ApiPropertyOptional({
    description: 'Mô tả chi phí',
    example: 'Thuê sân bóng',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Số tiền (VNĐ)',
    example: 600000,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Danh mục chi phí',
    enum: ExpenseCategory,
    example: ExpenseCategory.FIELD_RENTAL,
  })
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @ApiPropertyOptional({
    description: 'Match ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsOptional()
  matchId?: string;

  @ApiPropertyOptional({
    description: 'Ngày chi phí (ISO 8601)',
    example: '2025-01-16',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Thuê sân 3 tiếng',
  })
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
  balance: number; // Số tiền còn lại trong quỹ = Thu - Chi (hoặc Manual Balance + Thu - Chi)
  totalPending: number; // Tổng nợ nhóm (tổng số tiền các thành viên chưa đóng)
  manualBalance?: number | null; // Số dư quỹ được admin set thủ công (nếu có)
  manualBalanceSetAt?: Date | null; // Thời điểm admin set manual balance

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

  pendingBreakdown: {
    matchPayments: number; // Tiền trận chưa đóng
    monthlyFees: number; // Tiền tháng chưa đóng
    penalties: number; // Tiền phạt chưa đóng
  };
}

// DTOs for Fund Balance Management
export class SetFundBalanceDto {
  @ApiProperty({ 
    description: 'Fund balance amount (can be positive or negative)',
    example: 5000000,
    type: Number
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ 
    description: 'Note about this fund balance',
    example: 'Initial balance from Excel migration'
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class FundBalanceResponseDto {
  @ApiProperty({ description: 'Fund balance ID' })
  id: string;

  @ApiProperty({ description: 'Fund balance amount', example: 5000000 })
  amount: number;

  @ApiProperty({ description: 'Admin user ID who set the balance' })
  setBy: string;

  @ApiPropertyOptional({ description: 'Admin user name' })
  setByName?: string;

  @ApiPropertyOptional({ description: 'Note about this balance' })
  note?: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
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
