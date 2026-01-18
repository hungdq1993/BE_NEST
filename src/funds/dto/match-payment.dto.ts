import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PlayerPaymentDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Số tiền (VNĐ)',
    example: 100000,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Đã thanh toán chưa',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;
}

export class CreateMatchPaymentDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Match ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  matchId: string;

  @ApiProperty({
    description: 'Số tiền (VNĐ)',
    example: 100000,
  })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Đã thanh toán chưa',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiPropertyOptional({
    description: 'Ghi chú',
    example: 'Tiền thua trận',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class BulkCreateMatchPaymentDto {
  @ApiProperty({
    description: 'Match ID',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  matchId: string;

  @ApiProperty({
    description: 'Danh sách players và số tiền',
    type: [PlayerPaymentDto],
    example: [
      { userId: '507f1f77bcf86cd799439011', amount: 100000, isPaid: false },
      { userId: '507f1f77bcf86cd799439013', amount: 100000, isPaid: false },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerPaymentDto)
  players: PlayerPaymentDto[];
}

export class MatchPaymentResponseDto {
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

// Response cho bảng tổng hợp theo trận (như Excel)
export class MatchPaymentSummaryDto {
  matchId: string;
  matchDate: Date;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  playerCount: number;
  paidCount: number;
  payments: MatchPaymentResponseDto[];
}

// Response cho bảng tổng hợp theo thành viên
export class MemberPaymentSummaryDto {
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

// Response cho chi tiết match với payments và teams
export class MatchDetailWithPaymentsDto {
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
