import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatchPaymentDto {
  @IsString()
  userId: string;

  @IsString()
  matchId: string;

  @IsNumber()
  amount: number;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsString()
  @IsOptional()
  note?: string;
}

export class BulkCreateMatchPaymentDto {
  @IsString()
  matchId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerPaymentDto)
  players: PlayerPaymentDto[];
}

export class PlayerPaymentDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;
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
