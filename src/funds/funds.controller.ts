import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Put,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FundsService } from './funds.service.js';
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
  AllDebtsDto,
  CreateAndPayMonthlyFeeDto,
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, Role } from '../common/decorators/roles.decorator.js';

@Controller('funds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  // ==================== FUND SUMMARY (BẢNG TỔNG HỢP THU-CHI) ====================

  @Get('summary')
  @Roles(Role.ADMIN)
  async getFundSummary(): Promise<FundSummaryDto> {
    return this.fundsService.getFundSummary();
  }

  // ==================== MATCH PAYMENT ENDPOINTS (TIỀN ĐÓNG THEO TRẬN) ====================

  @Post('match-payments')
  @Roles(Role.ADMIN)
  async createMatchPayment(
    @Body() dto: CreateMatchPaymentDto,
  ): Promise<MatchPaymentResponseDto> {
    return this.fundsService.createMatchPayment(dto);
  }

  @Post('match-payments/bulk')
  @Roles(Role.ADMIN)
  async bulkCreateMatchPayments(
    @Body() dto: BulkCreateMatchPaymentDto,
  ): Promise<MatchPaymentResponseDto[]> {
    return this.fundsService.bulkCreateMatchPayments(dto);
  }

  @Get('match-payments')
  @Roles(Role.ADMIN)
  async findAllMatchPayments(
    @Query('matchId') matchId?: string,
  ): Promise<MatchPaymentResponseDto[]> {
    if (matchId) {
      return this.fundsService.findMatchPaymentsByMatch(matchId);
    }
    return this.fundsService.findAllMatchPayments();
  }

  @Get('match-payments/unpaid')
  @Roles(Role.ADMIN)
  async findUnpaidMatchPayments(): Promise<MatchPaymentResponseDto[]> {
    return this.fundsService.findUnpaidMatchPayments();
  }

  @Get('match-payments/match/:matchId')
  @Roles(Role.ADMIN)
  async findMatchPaymentsByMatch(
    @Param('matchId') matchId: string,
  ): Promise<MatchPaymentResponseDto[]> {
    return this.fundsService.findMatchPaymentsByMatch(matchId);
  }

  @Patch('match-payments/:id/pay')
  @Roles(Role.ADMIN)
  async markMatchPaymentPaid(
    @Param('id') id: string,
  ): Promise<MatchPaymentResponseDto> {
    return this.fundsService.markMatchPaymentPaid(id);
  }

  @Delete('match-payments/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMatchPayment(@Param('id') id: string): Promise<void> {
    return this.fundsService.deleteMatchPayment(id);
  }

  // ==================== EXPENSE ENDPOINTS (CHI TIÊU) ====================

  @Post('expenses')
  @Roles(Role.ADMIN)
  async createExpense(
    @Body() dto: CreateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    return this.fundsService.createExpense(dto);
  }

  @Get('expenses')
  @Roles(Role.ADMIN)
  async findAllExpenses(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('category') category?: string,
  ): Promise<ExpenseResponseDto[]> {
    return this.fundsService.findAllExpenses(startDate, endDate, category);
  }

  @Put('expenses/:id')
  @Roles(Role.ADMIN)
  async updateExpense(
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    return this.fundsService.updateExpense(id, dto);
  }

  @Delete('expenses/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExpense(@Param('id') id: string): Promise<void> {
    return this.fundsService.deleteExpense(id);
  }

  // ==================== MONTHLY FEE ENDPOINTS (TIỀN THÁNG) ====================

  @Post('monthly-fees')
  @Roles(Role.ADMIN)
  async createMonthlyFee(
    @Body() dto: CreateMonthlyFeeDto,
  ): Promise<MonthlyFeeResponseDto> {
    return this.fundsService.createMonthlyFee(dto);
  }

  @Post('monthly-fees/bulk')
  @Roles(Role.ADMIN)
  async bulkCreateMonthlyFees(
    @Body() dto: BulkCreateMonthlyFeeDto,
  ): Promise<MonthlyFeeResponseDto[]> {
    return this.fundsService.bulkCreateMonthlyFees(dto);
  }

  @Get('monthly-fees')
  @Roles(Role.ADMIN)
  async findAllMonthlyFees(): Promise<MonthlyFeeResponseDto[]> {
    return this.fundsService.findAllMonthlyFees();
  }

  @Get('monthly-fees/unpaid')
  @Roles(Role.ADMIN)
  async findUnpaidMonthlyFees(): Promise<MonthlyFeeResponseDto[]> {
    return this.fundsService.findUnpaidMonthlyFees();
  }

  @Get('monthly-fees/period')
  @Roles(Role.ADMIN)
  async findMonthlyFeesByPeriod(
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<MonthlyFeeResponseDto[]> {
    return this.fundsService.findMonthlyFeesByPeriod(month, year);
  }

  @Get('monthly-fees/period/status')
  @Roles(Role.ADMIN)
  async getMonthlyFeePeriodStatus(
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<MonthlyFeePeriodStatusDto> {
    return this.fundsService.getMonthlyFeePeriodStatus(month, year);
  }

  @Patch('monthly-fees/:id/pay')
  @Roles(Role.ADMIN)
  async markMonthlyFeePaid(
    @Param('id') id: string,
  ): Promise<MonthlyFeeResponseDto> {
    return this.fundsService.markMonthlyFeePaid(id);
  }

  // API mới: Tạo và mark paid monthly fee cho user (dùng khi user chưa có fee record)
  @Post('monthly-fees/pay')
  @Roles(Role.ADMIN)
  async createAndPayMonthlyFee(
    @Body() dto: CreateAndPayMonthlyFeeDto,
  ): Promise<MonthlyFeeResponseDto> {
    return this.fundsService.createAndPayMonthlyFee(dto);
  }

  @Delete('monthly-fees/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMonthlyFee(@Param('id') id: string): Promise<void> {
    return this.fundsService.deleteMonthlyFee(id);
  }

  // ==================== PENALTY ENDPOINTS (TIỀN PHẠT) ====================

  @Post('penalties')
  @Roles(Role.ADMIN)
  async createPenalty(
    @Body() dto: CreatePenaltyDto,
  ): Promise<PenaltyResponseDto> {
    return this.fundsService.createPenalty(dto);
  }

  @Get('penalties')
  @Roles(Role.ADMIN)
  async findAllPenalties(): Promise<PenaltyResponseDto[]> {
    return this.fundsService.findAllPenalties();
  }

  @Get('penalties/unpaid')
  @Roles(Role.ADMIN)
  async findUnpaidPenalties(): Promise<PenaltyResponseDto[]> {
    return this.fundsService.findUnpaidPenalties();
  }

  @Get('penalties/match/:matchId')
  @Roles(Role.ADMIN)
  async findPenaltiesByMatch(
    @Param('matchId') matchId: string,
  ): Promise<PenaltyResponseDto[]> {
    return this.fundsService.findPenaltiesByMatch(matchId);
  }

  @Patch('penalties/:id/pay')
  @Roles(Role.ADMIN)
  async markPenaltyPaid(@Param('id') id: string): Promise<PenaltyResponseDto> {
    return this.fundsService.markPenaltyPaid(id);
  }

  @Delete('penalties/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePenalty(@Param('id') id: string): Promise<void> {
    return this.fundsService.deletePenalty(id);
  }

  // ==================== STATS ENDPOINTS ====================

  @Get('stats')
  @Roles(Role.ADMIN)
  async getFundStats(): Promise<FundStatsDto> {
    return this.fundsService.getFundStats();
  }

  @Get('users-statistics')
  @Roles(Role.ADMIN)
  async getAllUsersStatistics(): Promise<UsersStatisticsDto> {
    return this.fundsService.getAllUsersStatistics();
  }

  @Get('user-summary/:userId')
  @Roles(Role.ADMIN)
  async getUserFundSummary(
    @Param('userId') userId: string,
    @Query('userName') userName: string = 'User',
  ): Promise<UserFundSummaryDto> {
    return this.fundsService.getUserFundSummary(userId, userName);
  }

  @Get('debts')
  @Roles(Role.ADMIN)
  async getAllDebts(): Promise<AllDebtsDto> {
    return this.fundsService.getAllDebts();
  }

  @Get('user-debt/:userId')
  @Roles(Role.ADMIN)
  async getUserDebtDetail(
    @Param('userId') userId: string,
    @Query('userName') userName: string = 'User',
  ): Promise<UserDebtDetailDto> {
    return this.fundsService.getUserDebtDetail(userId, userName);
  }

  // ==================== MATCH DETAIL WITH PAYMENTS ====================

  @Get('matches/:matchId')
  @Roles(Role.ADMIN, Role.CAPTAIN)
  async getMatchDetailWithPayments(
    @Param('matchId') matchId: string,
  ): Promise<MatchDetailWithPaymentsDto> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return await this.fundsService.getMatchDetailWithPayments(matchId);
  }

  @Post('matches/:matchId/process-losing-team')
  @Roles(Role.ADMIN)
  async processLosingTeam(
    @Param('matchId') matchId: string,
  ): Promise<MatchPaymentResponseDto[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return await this.fundsService.processLosingTeam(matchId);
  }
}
