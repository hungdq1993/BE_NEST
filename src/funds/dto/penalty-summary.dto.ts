import { PenaltyReason } from '../schemas/penalty.schema.js';

export class PenaltyResponseDto {
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

export class PenaltySummaryDto {
  userId: string;
  userName: string;
  totalPenalties: number;
  paidAmount: number;
  pendingAmount: number;
  penaltyCount: number;
  penalties: PenaltyResponseDto[];
}

export class PenaltyByReasonDto {
  reason: PenaltyReason;
  count: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}
