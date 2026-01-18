import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MatchDebtItemDto {
  @ApiProperty({ description: 'Match ID', example: '507f1f77bcf86cd799439011' })
  matchId: string;

  @ApiProperty({ description: 'Ngày đá', example: '2025-01-05T18:00:00Z' })
  date: Date;

  @ApiProperty({ description: 'Địa điểm', example: 'Sân A' })
  location: string;

  @ApiProperty({ description: 'Phí trận (VNĐ)', example: 30000 })
  fee: number;

  @ApiProperty({ description: 'Đã thanh toán chưa', example: false })
  isPaid: boolean;

  @ApiPropertyOptional({ description: 'Ngày thanh toán', example: '2025-01-06T10:00:00Z' })
  paidAt?: Date;

  @ApiPropertyOptional({ description: 'Hạn thanh toán', example: '2025-01-19' })
  dueDate?: string;
}

export class MonthlyFeeDebtDto {
  @ApiProperty({ description: 'Số tiền phí tháng (VNĐ)', example: 50000 })
  amount: number;

  @ApiProperty({ description: 'Đã thanh toán chưa', example: false })
  isPaid: boolean;

  @ApiPropertyOptional({ description: 'Ngày thanh toán', example: '2025-01-06T10:00:00Z' })
  paidAt?: Date;

  @ApiProperty({ description: 'Hạn thanh toán', example: '2025-01-31' })
  dueDate: string;
}

export class UserDebtSummaryDto {
  @ApiProperty({ description: 'Tổng phí trận (VNĐ)', example: 90000 })
  totalMatchFee: number;

  @ApiProperty({ description: 'Phí trận đã đóng (VNĐ)', example: 30000 })
  paidMatchFee: number;

  @ApiProperty({ description: 'Phí trận chưa đóng (VNĐ)', example: 60000 })
  unpaidMatchFee: number;

  @ApiProperty({ description: 'Tổng phí tháng (VNĐ)', example: 50000 })
  totalMonthlyFee: number;

  @ApiProperty({ description: 'Phí tháng chưa đóng (VNĐ)', example: 50000 })
  unpaidMonthlyFee: number;

  @ApiProperty({ description: 'Tổng nợ (VNĐ)', example: 110000 })
  totalDebt: number;

  @ApiProperty({ description: 'Số trận đã đá', example: 3 })
  matchesPlayed: number;

  @ApiProperty({ description: 'Số trận đã thanh toán', example: 1 })
  matchesPaid: number;

  @ApiProperty({ description: 'Số trận chưa thanh toán', example: 2 })
  matchesUnpaid: number;
}

export class UserMonthlyDebtDetailDto {
  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  userId: string;

  @ApiProperty({ description: 'Tên user', example: 'Nguyễn Văn A' })
  userName: string;

  @ApiPropertyOptional({ description: 'Avatar URL', example: 'https://...' })
  avatar?: string;

  @ApiProperty({ description: 'Trình độ kỹ năng', example: 7 })
  skillLevel: number;

  @ApiProperty({ description: 'Là sinh viên', example: false })
  isStudent: boolean;

  @ApiPropertyOptional({
    description: 'Nợ phí tháng',
    type: MonthlyFeeDebtDto,
  })
  monthlyFee?: MonthlyFeeDebtDto;

  @ApiProperty({
    description: 'Chi tiết các trận đã đá trong tháng',
    type: [MatchDebtItemDto],
  })
  matches: MatchDebtItemDto[];

  @ApiProperty({
    description: 'Tổng kết',
    type: UserDebtSummaryDto,
  })
  summary: UserDebtSummaryDto;
}

export class MonthlyDebtDetailsResponseDto {
  @ApiProperty({ description: 'Tháng', example: 1 })
  month: number;

  @ApiProperty({ description: 'Năm', example: 2025 })
  year: number;

  @ApiProperty({
    description: 'Danh sách users và chi tiết nợ',
    type: [UserMonthlyDebtDetailDto],
  })
  users: UserMonthlyDebtDetailDto[];
}

export class YearlyDebtDetailsResponseDto {
  @ApiProperty({ description: 'Năm', example: 2025 })
  year: number;

  @ApiProperty({
    description: 'Danh sách các tháng có dữ liệu',
    type: [MonthlyDebtDetailsResponseDto],
    example: [
      {
        month: 1,
        year: 2025,
        users: [
          {
            userId: '507f1f77bcf86cd799439011',
            userName: 'Nguyễn Văn A',
            avatar: 'https://...',
            skillLevel: 7,
            isStudent: false,
            monthlyFee: {
              amount: 200000,
              isPaid: false,
              dueDate: '2025-01-31',
            },
            matches: [],
            summary: {
              totalMatchFee: 0,
              paidMatchFee: 0,
              unpaidMatchFee: 0,
              totalMonthlyFee: 200000,
              unpaidMonthlyFee: 200000,
              totalDebt: 200000,
              matchesPlayed: 0,
              matchesPaid: 0,
              matchesUnpaid: 0,
            },
          },
        ],
      },
      {
        month: 2,
        year: 2025,
        users: [],
      },
    ],
  })
  months: MonthlyDebtDetailsResponseDto[];
}
