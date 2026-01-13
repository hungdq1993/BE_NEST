import { Role } from '../../common/decorators/roles.decorator.js';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: Role;
  skillLevel: number;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserWithStatsResponseDto extends UserResponseDto {
  // Financial stats
  totalDebt: number; // Tổng nợ (chưa đóng)
  totalPaid: number; // Tổng đã đóng
  unpaidMonthlyFees: number; // Tổng nợ tiền tháng chưa đóng
  unpaidMatchFees: number; // Tổng nợ tiền trận chưa đóng (thua trận)
  
  // Match stats
  matchesWon: number; // Số trận thắng
  matchesLost: number; // Số trận thua
  matchesDraw: number; // Số trận hòa
  totalMatches: number; // Tổng số trận
}
