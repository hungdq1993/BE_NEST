import {
  IsString,
  IsNumber,
  IsOptional,
  IsMongoId,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MonthlyFeeResponseDto {
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

export class FundStatsDto {
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

export class UserFundSummaryDto {
  userId: string;
  userName: string;
  // Tiền tháng
  totalMonthlyFees: number;
  paidMonthlyFees: number;
  pendingMonthlyFees: number;
  // Tiền phạt
  totalPenalties: number;
  paidPenalties: number;
  pendingPenalties: number;
  // Tiền trận (thua)
  totalMatchPayments: number;
  paidMatchPayments: number;
  pendingMatchPayments: number;
  // Tổng nợ
  totalOwed: number;
  totalPaid: number;
}

// Chi tiết nợ của user
export class UserDebtDetailDto {
  userId: string;
  userName: string;
  totalOwed: number;
  totalPaid: number;

  // Chi tiết tiền tháng chưa đóng
  unpaidMonthlyFees: {
    id: string;
    month: number;
    year: number;
    amount: number;
    note?: string;
    createdAt: Date;
  }[];

  // Chi tiết tiền trận chưa đóng
  unpaidMatchPayments: {
    id: string;
    matchId: string;
    matchDate?: Date;
    matchLocation?: string;
    amount: number;
    note?: string;
    createdAt: Date;
  }[];

  // Chi tiết tiền phạt chưa đóng
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

export class CreateMonthlyFeeDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Tháng (1-12)',
    example: 1,
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Năm',
    example: 2025,
    minimum: 2000,
    maximum: 2100,
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({
    description: 'Số tiền (VNĐ)',
    example: 200000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Phí tháng 1/2025',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

// DTO để tạo và mark paid monthly fee cho user
export class CreateAndPayMonthlyFeeDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Tháng (1-12)',
    example: 1,
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Năm',
    example: 2025,
    minimum: 2000,
    maximum: 2100,
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({
    description: 'Số tiền (VNĐ)',
    example: 200000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Phí tháng 1/2025',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class CreatePenaltyDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Match ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  @IsString()
  matchId: string;

  @ApiProperty({
    description: 'Số tiền phạt (VNĐ)',
    example: 50000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Lý do phạt',
    example: 'Đi trễ',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  reason: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết',
    example: 'Đến muộn 30 phút',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

// DTO để tạo monthly fees cho tất cả users
export class BulkCreateMonthlyFeeDto {
  @ApiProperty({
    description: 'Tháng (1-12)',
    example: 1,
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    description: 'Năm',
    example: 2025,
    minimum: 2000,
    maximum: 2100,
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty({
    description: 'Số tiền cho người bình thường (VNĐ)',
    example: 200000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number; // Số tiền cho người bình thường

  @ApiPropertyOptional({
    description: 'Số tiền cho sinh viên (VNĐ). Nếu không set thì dùng amount',
    example: 100000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  studentAmount?: number; // Số tiền cho sinh viên (nếu không set thì dùng amount)

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Phí tháng 1/2025',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

// DTO để trả về danh sách users đã/chưa thanh toán theo period
export class MonthlyFeePeriodStatusDto {
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
  // Tổng tiền chưa thu của tất cả các tháng trong năm
  totalUnpaidAllMonths: number;
}

// DTO để trả về thống kê của 1 user trong danh sách
export class UserStatisticsItemDto {
  userId: string;
  userName: string;
  email?: string;
  role: string;
  skillLevel: number;
  isActive: boolean;
  // Thống kê nợ
  totalOwed: number;
  totalPaid: number;
  // Chi tiết nợ
  pendingMonthlyFees: number;
  pendingPenalties: number;
  pendingMatchPayments: number;
  // Số trận thua
  losingMatchesCount: number;
  // Thống kê monthly fees
  totalMonthlyFees: number;
  paidMonthlyFees: number;
  unpaidMonthlyFees: number;
  // Thống kê penalties
  totalPenalties: number;
  paidPenalties: number;
  unpaidPenalties: number;
  // Thống kê match payments
  totalMatchPayments: number;
  paidMatchPayments: number;
  unpaidMatchPayments: number;
}

// DTO để trả về danh sách users với thống kê
export class UsersStatisticsDto {
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

// DTO cho 1 khoản nợ trong danh sách
export class DebtItemDto {
  id: string;
  type: 'MONTHLY_FEE' | 'PENALTY' | 'MATCH_PAYMENT';
  userId: string;
  userName: string;
  amount: number;
  createdAt: Date;
  // Monthly fee fields
  month?: number;
  year?: number;
  note?: string;
  // Penalty fields
  matchId?: string;
  matchDate?: Date;
  reason?: string;
  description?: string;
  // Match payment fields
  matchLocation?: string;
}

// DTO để trả về danh sách tất cả các khoản nợ
export class AllDebtsDto {
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
