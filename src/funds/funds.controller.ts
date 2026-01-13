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
import { Public } from '../common/decorators/public.decorator.js';

@Controller('funds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  // ==================== PUBLIC VIEW APIs ====================

  @Public()
  @Get('summary')
  async getFundSummary(): Promise<FundSummaryDto> {
    return this.fundsService.getFundSummary();
  }

  @Public()
  @Get('match-payments')
  async findAllMatchPayments(
    @Query('matchId') matchId?: string,
  ): Promise<MatchPaymentResponseDto[]> {
    if (matchId) {
      return this.fundsService.findMatchPaymentsByMatch(matchId);
    }
    return this.fundsService.findAllMatchPayments();
  }

  @Public()
  @Get('match-payments/unpaid')
  async findUnpaidMatchPayments(): Promise<MatchPaymentResponseDto[]> {
    return this.fundsService.findUnpaidMatchPayments();
  }

  @Public()
  @Get('match-payments/match/:matchId')
  async findMatchPaymentsByMatch(
    @Param('matchId') matchId: string,
  ): Promise<MatchPaymentResponseDto[]> {
    return this.fundsService.findMatchPaymentsByMatch(matchId);
  }

  @Public()
  @Get('expenses')
  async findAllExpenses(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('category') category?: string,
  ): Promise<ExpenseResponseDto[]> {
    return this.fundsService.findAllExpenses(startDate, endDate, category);
  }

  @Public()
  @Get('monthly-fees')
  async findAllMonthlyFees(): Promise<MonthlyFeeResponseDto[]> {
    return this.fundsService.findAllMonthlyFees();
  }

  @Public()
  @Get('monthly-fees/unpaid')
  async findUnpaidMonthlyFees(): Promise<MonthlyFeeResponseDto[]> {
    return this.fundsService.findUnpaidMonthlyFees();
  }

  @Public()
  @Get('monthly-fees/period')
  async findMonthlyFeesByPeriod(
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<MonthlyFeeResponseDto[]> {
    return this.fundsService.findMonthlyFeesByPeriod(month, year);
  }

  @Public()
  @Get('monthly-fees/period/status')
  async getMonthlyFeePeriodStatus(
    @Query('month') month: number,
    @Query('year') year: number,
  ): Promise<MonthlyFeePeriodStatusDto> {
    return this.fundsService.getMonthlyFeePeriodStatus(month, year);
  }

  @Public()
  @Get('penalties')
  async findAllPenalties(): Promise<PenaltyResponseDto[]> {
    return this.fundsService.findAllPenalties();
  }

  @Public()
  @Get('penalties/unpaid')
  async findUnpaidPenalties(): Promise<PenaltyResponseDto[]> {
    return this.fundsService.findUnpaidPenalties();
  }

  @Public()
  @Get('penalties/match/:matchId')
  async findPenaltiesByMatch(
    @Param('matchId') matchId: string,
  ): Promise<PenaltyResponseDto[]> {
    return this.fundsService.findPenaltiesByMatch(matchId);
  }

  @Public()
  @Get('stats')
  async getFundStats(): Promise<FundStatsDto> {
    return this.fundsService.getFundStats();
  }

  @Public()
  @Get('users-statistics')
  async getAllUsersStatistics(): Promise<UsersStatisticsDto> {
    return this.fundsService.getAllUsersStatistics();
  }

  @Public()
  @Get('user-summary/:userId')
  async getUserFundSummary(
    @Param('userId') userId: string,
    @Query('userName') userName: string = 'User',
  ): Promise<UserFundSummaryDto> {
    return this.fundsService.getUserFundSummary(userId, userName);
  }

  @Public()
  @Get('debts')
  async getAllDebts(): Promise<AllDebtsDto> {
    return this.fundsService.getAllDebts();
  }

  @Public()
  @Get('user-debt/:userId')
  async getUserDebtDetail(
    @Param('userId') userId: string,
    @Query('userName') userName: string = 'User',
  ): Promise<UserDebtDetailDto> {
    return this.fundsService.getUserDebtDetail(userId, userName);
  }

  @Public()
  @Get('matches/:matchId')
  async getMatchDetailWithPayments(
    @Param('matchId') matchId: string,
  ): Promise<MatchDetailWithPaymentsDto> {
    return await this.fundsService.getMatchDetailWithPayments(matchId);
  }

  // ==================== ADMIN ONLY APIs ====================

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

  @Post('expenses')
  @Roles(Role.ADMIN)
  async createExpense(
    @Body() dto: CreateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    return this.fundsService.createExpense(dto);
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

  @Patch('monthly-fees/:id/pay')
  @Roles(Role.ADMIN)
  async markMonthlyFeePaid(
    @Param('id') id: string,
  ): Promise<MonthlyFeeResponseDto> {
    return this.fundsService.markMonthlyFeePaid(id);
  }

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

  @Post('penalties')
  @Roles(Role.ADMIN)
  async createPenalty(
    @Body() dto: CreatePenaltyDto,
  ): Promise<PenaltyResponseDto> {
    return this.fundsService.createPenalty(dto);
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

  @Post('matches/:matchId/process-losing-team')
  @Roles(Role.ADMIN)
  async processLosingTeam(
    @Param('matchId') matchId: string,
  ): Promise<MatchPaymentResponseDto[]> {
    return await this.fundsService.processLosingTeam(matchId);
  }
}
