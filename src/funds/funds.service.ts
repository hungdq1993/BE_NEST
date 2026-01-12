import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FundsRepository } from './funds.repository.js';
import {
  MonthlyFeeResponseDto,
  FundStatsDto,
  UserFundSummaryDto,
  UserDebtDetailDto,
  CreateMonthlyFeeDto,
  CreatePenaltyDto,
  BulkCreateMonthlyFeeDto,
  MonthlyFeePeriodStatusDto,
  UsersStatisticsDto,
  UserStatisticsItemDto,
  AllDebtsDto,
  DebtItemDto,
} from './dto/fund-stats.dto.js';
import { PenaltyResponseDto } from './dto/penalty-summary.dto.js';
import {
  CreateMatchPaymentDto,
  BulkCreateMatchPaymentDto,
  MatchPaymentResponseDto,
  MatchDetailWithPaymentsDto,
} from './dto/match-payment.dto.js';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseResponseDto,
  FundSummaryDto,
} from './dto/expense.dto.js';
import { MonthlyFeeDocument } from './schemas/monthly-fee.schema.js';
import { PenaltyDocument } from './schemas/penalty.schema.js';
import { MatchPaymentDocument } from './schemas/match-payment.schema.js';
import { ExpenseDocument } from './schemas/expense.schema.js';
import { User } from '../users/schemas/user.schema.js';
import { Match } from '../matches/schemas/match.schema.js';
import { MatchesService } from '../matches/matches.service.js';
import { UsersService } from '../users/users.service.js';

// Type helpers for populated fields
type PopulatedUser = {
  _id: Types.ObjectId;
  name: string;
  email?: string;
};

type PopulatedMatch = {
  _id: Types.ObjectId;
  matchDate: Date;
  location?: string;
};

// Union types cho user và match có thể là ObjectId hoặc populated document
type UserReference = Types.ObjectId | User | PopulatedUser;
type MatchReference = Types.ObjectId | Match | PopulatedMatch;

// Type guards
function isPopulatedUser(user: UserReference): user is PopulatedUser {
  return (
    typeof user === 'object' && user !== null && '_id' in user && 'name' in user
  );
}

function isPopulatedMatch(match: MatchReference): match is PopulatedMatch {
  return (
    typeof match === 'object' &&
    match !== null &&
    '_id' in match &&
    'matchDate' in match
  );
}

// Helper functions để extract ID và name an toàn
function extractUserId(user: UserReference): string {
  if (!user) {
    return '';
  }
  if (isPopulatedUser(user)) {
    return user._id.toString();
  }
  if (user instanceof Types.ObjectId) {
    return user.toString();
  }
  // User document từ Mongoose có _id
  return (user as unknown as { _id: Types.ObjectId })._id.toString();
}

function extractUserName(user: UserReference): string | undefined {
  if (!user) {
    return undefined;
  }
  if (isPopulatedUser(user)) {
    return user.name;
  }
  if (user instanceof Types.ObjectId) {
    return undefined;
  }
  // User document có name property
  return (user as { name: string }).name;
}

function extractMatchId(match: MatchReference): string {
  if (!match) {
    return '';
  }
  if (isPopulatedMatch(match)) {
    return match._id.toString();
  }
  if (match instanceof Types.ObjectId) {
    return match.toString();
  }
  // Match document từ Mongoose có _id
  return (match as unknown as { _id: Types.ObjectId })._id.toString();
}

function extractMatchDate(match: MatchReference): Date | undefined {
  if (!match) {
    return undefined;
  }
  if (isPopulatedMatch(match)) {
    return match.matchDate;
  }
  if (match instanceof Types.ObjectId) {
    return undefined;
  }
  // Match document có matchDate property
  return (match as { matchDate: Date }).matchDate;
}

@Injectable()
export class FundsService {
  constructor(
    private readonly fundsRepository: FundsRepository,
    @Inject(forwardRef(() => MatchesService))
    private readonly matchesService: MatchesService,
    private readonly usersService: UsersService,
  ) {}

  // ==================== MATCH PAYMENT METHODS ====================

  async createMatchPayment(
    dto: CreateMatchPaymentDto,
  ): Promise<MatchPaymentResponseDto> {
    const payment = await this.fundsRepository.createMatchPayment(dto);
    return this.toMatchPaymentResponseDto(payment);
  }

  async bulkCreateMatchPayments(
    dto: BulkCreateMatchPaymentDto,
  ): Promise<MatchPaymentResponseDto[]> {
    const payments = await this.fundsRepository.bulkCreateMatchPayments(dto);
    return payments.map((p) => this.toMatchPaymentResponseDto(p));
  }

  async findMatchPaymentsByMatch(
    matchId: string,
  ): Promise<MatchPaymentResponseDto[]> {
    const payments =
      await this.fundsRepository.findMatchPaymentsByMatch(matchId);
    return payments.map((p) => this.toMatchPaymentResponseDto(p));
  }

  async findAllMatchPayments(): Promise<MatchPaymentResponseDto[]> {
    const payments = await this.fundsRepository.findAllMatchPayments();
    // Filter out payments với user hoặc match null (data không hợp lệ)
    const validPayments = payments.filter(
      (p) => p.user && p.match,
    );
    return validPayments.map((p) => this.toMatchPaymentResponseDto(p));
  }

  async findUnpaidMatchPayments(): Promise<MatchPaymentResponseDto[]> {
    const payments = await this.fundsRepository.findUnpaidMatchPayments();
    return payments.map((p) => this.toMatchPaymentResponseDto(p));
  }

  async markMatchPaymentPaid(id: string): Promise<MatchPaymentResponseDto> {
    const payment = await this.fundsRepository.markMatchPaymentPaid(id);
    if (!payment) throw new NotFoundException('Match payment not found');
    return this.toMatchPaymentResponseDto(payment);
  }

  async deleteMatchPayment(id: string): Promise<void> {
    const payment = await this.fundsRepository.deleteMatchPayment(id);
    if (!payment) throw new NotFoundException('Match payment not found');
  }

  // ==================== EXPENSE METHODS ====================

  async createExpense(dto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    const expense = await this.fundsRepository.createExpense(dto);
    return this.toExpenseResponseDto(expense);
  }

  async findAllExpenses(
    startDate?: string,
    endDate?: string,
    category?: string,
  ): Promise<ExpenseResponseDto[]> {
    const expenses = await this.fundsRepository.findAllExpenses(
      startDate,
      endDate,
      category,
    );
    return expenses.map((e) => this.toExpenseResponseDto(e));
  }

  async updateExpense(
    id: string,
    dto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.fundsRepository.updateExpense(id, dto);
    if (!expense) throw new NotFoundException('Expense not found');
    return this.toExpenseResponseDto(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    const expense = await this.fundsRepository.deleteExpense(id);
    if (!expense) throw new NotFoundException('Expense not found');
  }

  // ==================== FUND SUMMARY (THU-CHI) ====================

  async getFundSummary(): Promise<FundSummaryDto> {
    return this.fundsRepository.getFundSummary();
  }

  // ==================== MONTHLY FEE METHODS ====================

  async createMonthlyFee(
    dto: CreateMonthlyFeeDto,
  ): Promise<MonthlyFeeResponseDto> {
    try {
      const fee = await this.fundsRepository.createMonthlyFee(dto);
      return this.toMonthlyFeeResponseDto(fee);
    } catch (error) {
      // Xử lý lỗi duplicate key (unique index: user, month, year)
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new BadRequestException(
          `Tiền tháng cho user này trong tháng ${dto.month}/${dto.year} đã tồn tại`,
        );
      }
      throw error;
    }
  }

  async bulkCreateMonthlyFees(
    dto: BulkCreateMonthlyFeeDto,
  ): Promise<MonthlyFeeResponseDto[]> {
    // Lấy tất cả users trong hệ thống
    const users = await this.usersService.findAll();

    if (users.length === 0) {
      throw new BadRequestException('Không có user nào trong hệ thống');
    }

    // Tạo monthly fees cho tất cả users
    const fees = await this.fundsRepository.bulkCreateMonthlyFees(
      dto,
      users.map((u) => u.id),
    );

    return fees.map((f) => this.toMonthlyFeeResponseDto(f));
  }

  async findAllMonthlyFees(): Promise<MonthlyFeeResponseDto[]> {
    const fees = await this.fundsRepository.findAllMonthlyFees();
    return fees.map((f) => this.toMonthlyFeeResponseDto(f));
  }

  async findMonthlyFeesByUser(
    userId: string,
  ): Promise<MonthlyFeeResponseDto[]> {
    const fees = await this.fundsRepository.findMonthlyFeesByUser(userId);
    return fees.map((f) => this.toMonthlyFeeResponseDto(f));
  }

  async findMonthlyFeesByPeriod(
    month: number,
    year: number,
  ): Promise<MonthlyFeeResponseDto[]> {
    const fees = await this.fundsRepository.findMonthlyFeesByPeriod(
      month,
      year,
    );
    return fees.map((f) => this.toMonthlyFeeResponseDto(f));
  }

  async getMonthlyFeePeriodStatus(
    month: number,
    year: number,
  ): Promise<MonthlyFeePeriodStatusDto> {
    // Lấy tất cả users
    const allUsers = await this.usersService.findAll();

    // Lấy tất cả monthly fees của period này
    const fees = await this.fundsRepository.findMonthlyFeesByPeriod(month, year);

    // Lấy tổng tiền chưa thu của tất cả các tháng trong năm hiện tại
    const unpaidFeesInYear = await this.fundsRepository.findUnpaidMonthlyFeesByYear(year);
    const totalUnpaidAllMonths = unpaidFeesInYear.reduce((sum, fee) => sum + fee.amount, 0);

    // Tạo map fee theo userId để dễ lookup
    const feeMap = new Map<string, MonthlyFeeDocument>();
    fees.forEach((fee) => {
      const userId = extractUserId(fee.user);
      feeMap.set(userId, fee);
    });

    // Phân loại users đã/chưa thanh toán
    const paidUsers: MonthlyFeePeriodStatusDto['paidUsers'] = [];
    const unpaidUsers: MonthlyFeePeriodStatusDto['unpaidUsers'] = [];

    let totalAmount = 0;
    let paidAmount = 0;
    let unpaidAmount = 0;

    for (const user of allUsers) {
      const fee = feeMap.get(user.id);

      if (!fee) {
        // Chưa có fee cho user này
        unpaidUsers.push({
          userId: user.id,
          userName: user.name,
          amount: 0, // Chưa tạo fee
        });
        continue;
      }

      totalAmount += fee.amount;

      if (fee.isPaid) {
        paidUsers.push({
          userId: user.id,
          userName: extractUserName(fee.user) || user.name,
          feeId: fee._id.toString(),
          amount: fee.amount,
          paidAt: fee.paidAt || fee.updatedAt,
        });
        paidAmount += fee.amount;
      } else {
        unpaidUsers.push({
          userId: user.id,
          userName: extractUserName(fee.user) || user.name,
          feeId: fee._id.toString(),
          amount: fee.amount,
        });
        unpaidAmount += fee.amount;
      }
    }

    return {
      month,
      year,
      totalUsers: allUsers.length,
      paidUsers,
      unpaidUsers,
      totalAmount,
      paidAmount,
      unpaidAmount,
      totalUnpaidAllMonths,
    };
  }

  async findUnpaidMonthlyFees(): Promise<MonthlyFeeResponseDto[]> {
    const fees = await this.fundsRepository.findUnpaidMonthlyFees();
    return fees.map((f) => this.toMonthlyFeeResponseDto(f));
  }

  async markMonthlyFeePaid(id: string): Promise<MonthlyFeeResponseDto> {
    const fee = await this.fundsRepository.markMonthlyFeePaid(id);
    if (!fee) throw new NotFoundException('Monthly fee not found');
    return this.toMonthlyFeeResponseDto(fee);
  }

  // Tạo và mark paid monthly fee cho user (dùng khi user chưa có fee record)
  async createAndPayMonthlyFee(
    dto: CreateMonthlyFeeDto,
  ): Promise<MonthlyFeeResponseDto> {
    // Kiểm tra xem đã có fee cho user này trong tháng chưa
    const existingFees = await this.fundsRepository.findMonthlyFeesByPeriod(dto.month, dto.year);
    const existingFee = existingFees.find(f => extractUserId(f.user) === dto.userId);
    
    if (existingFee) {
      // Nếu đã có fee, mark paid
      if (existingFee.isPaid) {
        throw new BadRequestException('User đã đóng tiền tháng này rồi');
      }
      const paidFee = await this.fundsRepository.markMonthlyFeePaid(existingFee._id.toString());
      if (!paidFee) throw new NotFoundException('Monthly fee not found');
      return this.toMonthlyFeeResponseDto(paidFee);
    }
    
    // Nếu chưa có fee, tạo mới và mark paid luôn
    const fee = await this.fundsRepository.createAndPayMonthlyFee(dto);
    return this.toMonthlyFeeResponseDto(fee);
  }

  async deleteMonthlyFee(id: string): Promise<void> {
    const fee = await this.fundsRepository.deleteMonthlyFee(id);
    if (!fee) throw new NotFoundException('Monthly fee not found');
  }

  // ==================== PENALTY METHODS ====================

  async createPenalty(dto: CreatePenaltyDto): Promise<PenaltyResponseDto> {
    const penalty = await this.fundsRepository.createPenalty(dto);
    return this.toPenaltyResponseDto(penalty);
  }

  async findAllPenalties(): Promise<PenaltyResponseDto[]> {
    const penalties = await this.fundsRepository.findAllPenalties();
    return penalties.map((p) => this.toPenaltyResponseDto(p));
  }

  async findPenaltiesByUser(userId: string): Promise<PenaltyResponseDto[]> {
    const penalties = await this.fundsRepository.findPenaltiesByUser(userId);
    return penalties.map((p) => this.toPenaltyResponseDto(p));
  }

  async findPenaltiesByMatch(matchId: string): Promise<PenaltyResponseDto[]> {
    const penalties = await this.fundsRepository.findPenaltiesByMatch(matchId);
    return penalties.map((p) => this.toPenaltyResponseDto(p));
  }

  async findUnpaidPenalties(): Promise<PenaltyResponseDto[]> {
    const penalties = await this.fundsRepository.findUnpaidPenalties();
    return penalties.map((p) => this.toPenaltyResponseDto(p));
  }

  async markPenaltyPaid(id: string): Promise<PenaltyResponseDto> {
    const penalty = await this.fundsRepository.markPenaltyPaid(id);
    if (!penalty) throw new NotFoundException('Penalty not found');
    return this.toPenaltyResponseDto(penalty);
  }

  async deletePenalty(id: string): Promise<void> {
    const penalty = await this.fundsRepository.deletePenalty(id);
    if (!penalty) throw new NotFoundException('Penalty not found');
  }

  // ==================== STATS METHODS ====================

  async getFundStats(): Promise<FundStatsDto> {
    const [monthlyFeeStats, penaltyStats] = await Promise.all([
      this.fundsRepository.getMonthlyFeeStats(),
      this.fundsRepository.getPenaltyStats(),
    ]);

    const totalCollected =
      monthlyFeeStats.reduce((sum, s) => sum + s.collected, 0) +
      penaltyStats.collectedPenalties;
    const totalPending =
      monthlyFeeStats.reduce((sum, s) => sum + s.pending, 0) +
      penaltyStats.pendingPenalties;

    return {
      totalCollected,
      totalPending,
      monthlyFeeStats: monthlyFeeStats.map((s) => ({
        month: s._id.month,
        year: s._id.year,
        collected: s.collected,
        pending: s.pending,
        paidCount: s.paidCount,
        unpaidCount: s.unpaidCount,
      })),
      penaltyStats,
    };
  }

  async getAllUsersStatistics(): Promise<UsersStatisticsDto> {
    // Lấy tất cả users
    const allUsers = await this.usersService.findAll();

    // Lấy thống kê cho từng user
    const userStatsPromises = allUsers.map(async (user) => {
      const summary = await this.fundsRepository.getUserFundSummary(user.id);

      // Đếm số trận thua (match payments chưa đóng)
      const matchPayments =
        await this.fundsRepository.findMatchPaymentsByUser(user.id);
      const losingMatchesCount = matchPayments.filter(
        (p) => !p.isPaid,
      ).length;

      const totalOwed =
        summary.monthlyFees.pending +
        summary.penalties.pending +
        summary.matchPayments.pending;
      const totalPaid =
        summary.monthlyFees.paid +
        summary.penalties.paid +
        summary.matchPayments.paid;

      return {
        userId: user.id,
        userName: user.name,
        email: user.email,
        role: user.role,
        skillLevel: user.skillLevel,
        isActive: user.isActive,
        totalOwed,
        totalPaid,
        pendingMonthlyFees: summary.monthlyFees.pending,
        pendingPenalties: summary.penalties.pending,
        pendingMatchPayments: summary.matchPayments.pending,
        losingMatchesCount,
        totalMonthlyFees: summary.monthlyFees.total,
        paidMonthlyFees: summary.monthlyFees.paid,
        unpaidMonthlyFees: summary.monthlyFees.pending,
        totalPenalties: summary.penalties.total,
        paidPenalties: summary.penalties.paid,
        unpaidPenalties: summary.penalties.pending,
        totalMatchPayments: summary.matchPayments.total,
        paidMatchPayments: summary.matchPayments.paid,
        unpaidMatchPayments: summary.matchPayments.pending,
      } as UserStatisticsItemDto;
    });

    const users = await Promise.all(userStatsPromises);

    // Tính tổng summary
    const summary = {
      totalOwed: users.reduce((sum, u) => sum + u.totalOwed, 0),
      totalPaid: users.reduce((sum, u) => sum + u.totalPaid, 0),
      totalPendingMonthlyFees: users.reduce(
        (sum, u) => sum + u.pendingMonthlyFees,
        0,
      ),
      totalPendingPenalties: users.reduce(
        (sum, u) => sum + u.pendingPenalties,
        0,
      ),
      totalPendingMatchPayments: users.reduce(
        (sum, u) => sum + u.pendingMatchPayments,
        0,
      ),
    };

    return {
      totalUsers: users.length,
      users,
      summary,
    };
  }

  async getUserFundSummary(
    userId: string,
    userName: string,
  ): Promise<UserFundSummaryDto> {
    const summary = await this.fundsRepository.getUserFundSummary(userId);
    const totalOwed =
      summary.monthlyFees.pending +
      summary.penalties.pending +
      summary.matchPayments.pending;
    const totalPaid =
      summary.monthlyFees.paid +
      summary.penalties.paid +
      summary.matchPayments.paid;

    return {
      userId,
      userName,
      totalMonthlyFees: summary.monthlyFees.total,
      paidMonthlyFees: summary.monthlyFees.paid,
      pendingMonthlyFees: summary.monthlyFees.pending,
      totalPenalties: summary.penalties.total,
      paidPenalties: summary.penalties.paid,
      pendingPenalties: summary.penalties.pending,
      totalMatchPayments: summary.matchPayments.total,
      paidMatchPayments: summary.matchPayments.paid,
      pendingMatchPayments: summary.matchPayments.pending,
      totalOwed,
      totalPaid,
    };
  }

  // Lấy tất cả các khoản nợ của tất cả users
  async getAllDebts(): Promise<AllDebtsDto> {
    // Lấy tất cả unpaid items
    const [unpaidMonthlyFees, unpaidPenalties, unpaidMatchPayments] =
      await Promise.all([
        this.fundsRepository.findUnpaidMonthlyFees(),
        this.fundsRepository.findUnpaidPenalties(),
        this.fundsRepository.findUnpaidMatchPayments(),
      ]);

    // Map monthly fees
    const monthlyFeeDebts: DebtItemDto[] = unpaidMonthlyFees.map((fee) => ({
      id: fee._id.toString(),
      type: 'MONTHLY_FEE',
      userId: extractUserId(fee.user),
      userName: extractUserName(fee.user) || 'Unknown',
      amount: fee.amount,
      createdAt: fee.createdAt,
      month: fee.month,
      year: fee.year,
      note: fee.note,
    }));

    // Map penalties
    const penaltyDebts: DebtItemDto[] = unpaidPenalties.map((penalty) => ({
      id: penalty._id.toString(),
      type: 'PENALTY',
      userId: extractUserId(penalty.user),
      userName: extractUserName(penalty.user) || 'Unknown',
      amount: penalty.amount,
      createdAt: penalty.createdAt,
      matchId: extractMatchId(penalty.match),
      matchDate: extractMatchDate(penalty.match),
      reason: penalty.reason,
      description: penalty.description,
    }));

    // Map match payments
    const matchPaymentDebts: DebtItemDto[] = unpaidMatchPayments.map(
      (payment) => ({
        id: payment._id.toString(),
        type: 'MATCH_PAYMENT',
        userId: extractUserId(payment.user),
        userName: extractUserName(payment.user) || 'Unknown',
        amount: payment.amount,
        createdAt: payment.createdAt,
        matchId: extractMatchId(payment.match),
        matchDate: extractMatchDate(payment.match),
        matchLocation: isPopulatedMatch(payment.match)
          ? payment.match.location
          : undefined,
        note: payment.note,
      }),
    );

    // Combine tất cả debts
    const allDebts = [
      ...monthlyFeeDebts,
      ...penaltyDebts,
      ...matchPaymentDebts,
    ];

    // Tính summary
    const monthlyFeesAmount = monthlyFeeDebts.reduce(
      (sum, d) => sum + d.amount,
      0,
    );
    const penaltiesAmount = penaltyDebts.reduce((sum, d) => sum + d.amount, 0);
    const matchPaymentsAmount = matchPaymentDebts.reduce(
      (sum, d) => sum + d.amount,
      0,
    );

    return {
      totalDebts: allDebts.length,
      totalAmount: monthlyFeesAmount + penaltiesAmount + matchPaymentsAmount,
      debts: allDebts,
      summary: {
        monthlyFeesCount: monthlyFeeDebts.length,
        monthlyFeesAmount,
        penaltiesCount: penaltyDebts.length,
        penaltiesAmount,
        matchPaymentsCount: matchPaymentDebts.length,
        matchPaymentsAmount,
      },
    };
  }

  // Chi tiết nợ của user
  async getUserDebtDetail(
    userId: string,
    userName: string,
  ): Promise<UserDebtDetailDto> {
    const debtDetail = await this.fundsRepository.getUserDebtDetail(userId);

    const unpaidMonthlyFees = debtDetail.unpaidMonthlyFees.map((fee) => ({
      id: fee._id.toString(),
      month: fee.month,
      year: fee.year,
      amount: fee.amount,
      note: fee.note,
      createdAt: fee.createdAt,
    }));

    const unpaidMatchPayments = debtDetail.unpaidMatchPayments.map(
      (payment) => ({
        id: payment._id.toString(),
        matchId: extractMatchId(payment.match),
        matchDate: extractMatchDate(payment.match),
        matchLocation: isPopulatedMatch(payment.match)
          ? payment.match.location
          : undefined,
        amount: payment.amount,
        note: payment.note,
        createdAt: payment.createdAt,
      }),
    );

    const unpaidPenalties = debtDetail.unpaidPenalties.map((penalty) => ({
      id: penalty._id.toString(),
      matchId: extractMatchId(penalty.match),
      matchDate: extractMatchDate(penalty.match),
      reason: penalty.reason,
      description: penalty.description,
      amount: penalty.amount,
      createdAt: penalty.createdAt,
    }));

    const totalOwed =
      unpaidMonthlyFees.reduce((sum, f) => sum + f.amount, 0) +
      unpaidMatchPayments.reduce((sum, p) => sum + p.amount, 0) +
      unpaidPenalties.reduce((sum, p) => sum + p.amount, 0);

    // Tính tổng đã đóng
    const summary = await this.fundsRepository.getUserFundSummary(userId);
    const totalPaid =
      summary.monthlyFees.paid +
      summary.penalties.paid +
      summary.matchPayments.paid;

    return {
      userId,
      userName,
      totalOwed,
      totalPaid,
      unpaidMonthlyFees,
      unpaidMatchPayments,
      unpaidPenalties,
    };
  }

  // ==================== MATCH DETAIL WITH PAYMENTS ====================

  async getMatchDetailWithPayments(
    matchId: string,
  ): Promise<MatchDetailWithPaymentsDto> {
    // Lấy thông tin match với teams
    const matchWithLineups = await this.matchesService.findMatchById(matchId);
    if (!matchWithLineups) {
      throw new NotFoundException('Match not found');
    }

    // Lấy tất cả payments của match này
    const payments =
      await this.fundsRepository.findMatchPaymentsByMatch(matchId);

    // Xác định team thắng/thua
    let winningTeam: 'A' | 'B' | 'DRAW' | undefined;
    if (matchWithLineups.result) {
      const { teamAScore, teamBScore } = matchWithLineups.result;
      if (teamAScore > teamBScore) {
        winningTeam = 'A';
      } else if (teamBScore > teamAScore) {
        winningTeam = 'B';
      } else {
        winningTeam = 'DRAW';
      }
    }

    // Tạo map payment theo userId để dễ lookup
    const paymentMap = new Map<string, MatchPaymentDocument>();
    payments.forEach((payment) => {
      const userId = extractUserId(payment.user);
      paymentMap.set(userId, payment);
    });

    // Map players với payment info
    const mapPlayersWithPayment = (
      players: Array<{ id: string; name: string; skillLevel: number }>,
    ) => {
      return players.map((player) => {
        const payment = paymentMap.get(player.id);
        return {
          id: player.id,
          name: player.name,
          skillLevel: player.skillLevel,
          payment: payment
            ? {
                id: payment._id.toString(),
                amount: payment.amount,
                isPaid: payment.isPaid,
                paidAt: payment.paidAt,
              }
            : undefined,
        };
      });
    };

    // Tạo danh sách players team thua (nếu có kết quả)
    const losingTeamPlayers: Array<{
      userId: string;
      userName: string;
      amount: number;
      isPaid: boolean;
    }> = [];

    if (winningTeam && winningTeam !== 'DRAW' && matchWithLineups.result) {
      const losingTeam =
        winningTeam === 'A' ? matchWithLineups.teamB : matchWithLineups.teamA;
      if (losingTeam) {
        losingTeam.players.forEach((player) => {
          const payment = paymentMap.get(player.id);
          losingTeamPlayers.push({
            userId: player.id,
            userName: player.name,
            amount: payment?.amount || matchWithLineups.matchFee,
            isPaid: payment?.isPaid || false,
          });
        });
      }
    }

    return {
      matchId: matchWithLineups.id,
      matchDate: matchWithLineups.matchDate,
      location: matchWithLineups.location,
      status: matchWithLineups.status,
      matchFee: matchWithLineups.matchFee,
      result: matchWithLineups.result,
      winningTeam,
      teamA: matchWithLineups.teamA
        ? {
            id: matchWithLineups.teamA.id,
            players: mapPlayersWithPayment(matchWithLineups.teamA.players),
            totalSkillLevel: matchWithLineups.teamA.totalSkillLevel,
          }
        : undefined,
      teamB: matchWithLineups.teamB
        ? {
            id: matchWithLineups.teamB.id,
            players: mapPlayersWithPayment(matchWithLineups.teamB.players),
            totalSkillLevel: matchWithLineups.teamB.totalSkillLevel,
          }
        : undefined,
      losingTeamPlayers:
        losingTeamPlayers.length > 0 ? losingTeamPlayers : undefined,
      notes: matchWithLineups.notes,
      createdAt: matchWithLineups.createdAt,
      updatedAt: matchWithLineups.updatedAt,
    };
  }

  // ==================== PROCESS LOSING TEAM ====================

  async processLosingTeam(matchId: string): Promise<MatchPaymentResponseDto[]> {
    // Lấy thông tin match với teams
    const matchWithLineups = await this.matchesService.findMatchById(matchId);
    if (!matchWithLineups) {
      throw new NotFoundException('Match not found');
    }

    // Kiểm tra match đã có kết quả chưa
    if (!matchWithLineups.result) {
      throw new BadRequestException('Match chưa có kết quả');
    }

    const { teamAScore, teamBScore } = matchWithLineups.result;

    // Xác định team thua
    let losingTeam: 'A' | 'B' | null = null;
    if (teamAScore > teamBScore) {
      losingTeam = 'B';
    } else if (teamBScore > teamAScore) {
      losingTeam = 'A';
    } else {
      // Hòa thì không có team thua
      throw new BadRequestException('Trận đấu hòa, không có team thua');
    }

    // Lấy team thua
    const losingTeamData =
      losingTeam === 'A' ? matchWithLineups.teamA : matchWithLineups.teamB;
    if (!losingTeamData) {
      throw new BadRequestException('Không tìm thấy thông tin team thua');
    }

    // Kiểm tra đã có payments chưa
    const existingPayments =
      await this.fundsRepository.findMatchPaymentsByMatch(matchId);
    if (existingPayments.length > 0) {
      // Đã có payments rồi, trả về payments hiện có
      return existingPayments.map((p) => this.toMatchPaymentResponseDto(p));
    }

    // Tạo match payments cho tất cả players trong team thua
    const matchFee = matchWithLineups.matchFee;
    const payments: MatchPaymentResponseDto[] = [];

    for (const player of losingTeamData.players) {
      const payment = await this.fundsRepository.createMatchPayment({
        userId: player.id,
        matchId,
        amount: matchFee,
        isPaid: false,
        note: `Tiền thua trận ${matchWithLineups.location} - ${new Date(matchWithLineups.matchDate).toLocaleDateString('vi-VN')}`,
      });
      payments.push(this.toMatchPaymentResponseDto(payment));
    }

    return payments;
  }

  // ==================== PRIVATE METHODS ====================

  private toMatchPaymentResponseDto(
    payment: MatchPaymentDocument,
  ): MatchPaymentResponseDto {
    return {
      id: payment._id.toString(),
      userId: extractUserId(payment.user),
      userName: extractUserName(payment.user),
      matchId: extractMatchId(payment.match),
      matchDate: extractMatchDate(payment.match),
      amount: payment.amount,
      isPaid: payment.isPaid,
      paidAt: payment.paidAt,
      note: payment.note,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private toExpenseResponseDto(expense: ExpenseDocument): ExpenseResponseDto {
    return {
      id: expense._id.toString(),
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      matchId: expense.match ? extractMatchId(expense.match) : undefined,
      matchDate: expense.match ? extractMatchDate(expense.match) : undefined,
      date: expense.date,
      note: expense.note,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }

  private toMonthlyFeeResponseDto(
    fee: MonthlyFeeDocument,
  ): MonthlyFeeResponseDto {
    return {
      id: fee._id.toString(),
      userId: extractUserId(fee.user),
      userName: extractUserName(fee.user),
      month: fee.month,
      year: fee.year,
      amount: fee.amount,
      isPaid: fee.isPaid,
      paidAt: fee.paidAt,
      note: fee.note,
      createdAt: fee.createdAt,
      updatedAt: fee.updatedAt,
    };
  }

  private toPenaltyResponseDto(penalty: PenaltyDocument): PenaltyResponseDto {
    return {
      id: penalty._id.toString(),
      userId: extractUserId(penalty.user),
      userName: extractUserName(penalty.user),
      matchId: extractMatchId(penalty.match),
      matchDate: extractMatchDate(penalty.match),
      amount: penalty.amount,
      reason: penalty.reason,
      description: penalty.description,
      isPaid: penalty.isPaid,
      paidAt: penalty.paidAt,
      createdAt: penalty.createdAt,
      updatedAt: penalty.updatedAt,
    };
  }
}
