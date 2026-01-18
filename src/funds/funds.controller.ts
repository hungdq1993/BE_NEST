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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
import { BulkMarkMonthlyFeePaidDto } from './dto/bulk-mark-paid.dto.js';
import { BulkMarkMatchPaymentPaidDto } from './dto/bulk-mark-match-payment-paid.dto.js';
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
  SetFundBalanceDto,
  FundBalanceResponseDto,
} from './dto/expense.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, Role } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@ApiTags('funds')
@Controller('funds')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FundsController {
  constructor(private readonly fundsService: FundsService) {}

  // ==================== PUBLIC VIEW APIs ====================

  @Public()
  @Get('summary')
  @ApiOperation({ summary: 'Lấy tổng hợp thu chi' })
  async getFundSummary(): Promise<FundSummaryDto> {
    return this.fundsService.getFundSummary();
  }

  @Public()
  @Get('debt-details')
  @ApiOperation({ 
    summary: 'Lấy chi tiết nợ của tất cả users',
    description: 'Nếu truyền month: lấy 1 tháng cụ thể. Nếu chỉ truyền year: lấy tất cả các tháng trong năm đó có dữ liệu.'
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết nợ theo tháng hoặc theo năm',
    schema: {
      oneOf: [
        {
          description: 'Response khi lấy 1 tháng (có month param)',
          example: {
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
                matches: [
                  {
                    matchId: '507f1f77bcf86cd799439012',
                    date: '2025-01-05T18:00:00Z',
                    location: 'Sân A',
                    fee: 100000,
                    isPaid: true,
                    paidAt: '2025-01-06T10:00:00Z',
                    dueDate: '2025-01-12',
                  },
                ],
                summary: {
                  totalMatchFee: 100000,
                  paidMatchFee: 100000,
                  unpaidMatchFee: 0,
                  totalMonthlyFee: 200000,
                  unpaidMonthlyFee: 200000,
                  totalDebt: 200000,
                  matchesPlayed: 1,
                  matchesPaid: 1,
                  matchesUnpaid: 0,
                },
              },
            ],
          },
        },
        {
          description: 'Response khi lấy cả năm (không có month param) - Mỗi tháng có field month và year rõ ràng',
          example: {
            year: 2025,
            months: [
              {
                month: 1,
                year: 2025,
                users: [
                  {
                    userId: '507f1f77bcf86cd799439011',
                    userName: 'Nguyễn Văn A',
                    summary: {
                      totalDebt: 200000,
                    },
                  },
                ],
              },
              {
                month: 2,
                year: 2025,
                users: [
                  {
                    userId: '507f1f77bcf86cd799439012',
                    userName: 'Nguyễn Văn B',
                    summary: {
                      totalDebt: 150000,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  })
  async getDebtDetails(
    @Query('month') month?: number,
    @Query('year') year?: number,
  ): Promise<any> {
    // Nếu có month thì lấy 1 tháng, nếu không thì lấy cả năm
    if (month) {
      return this.fundsService.getDebtDetailsByMonth(month, year);
    } else {
      return this.fundsService.getDebtDetailsByYear(year);
    }
  }

  @Public()
  @Get('match-payments')
  @ApiOperation({ summary: 'Lấy danh sách match payments' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu đã thanh toán match payment (1 user)' })
  async markMatchPaymentPaid(
    @Param('id') id: string,
  ): Promise<MatchPaymentResponseDto> {
    return this.fundsService.markMatchPaymentPaid(id);
  }

  @Post('match-payments/bulk/mark-paid-by-users')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu đã thanh toán match payments hàng loạt theo users' })
  @ApiResponse({
    status: 200,
    description: 'Đánh dấu thành công',
    schema: {
      example: {
        updated: 2,
        payments: [
          {
            id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439012',
            userName: 'Nguyễn Văn A',
            matchId: '507f1f77bcf86cd799439013',
            matchDate: '2025-01-15T10:00:00.000Z',
            amount: 100000,
            isPaid: true,
            paidAt: '2025-01-16T10:30:00.000Z',
            note: 'Tiền thua trận',
            createdAt: '2025-01-15T12:00:00.000Z',
            updatedAt: '2025-01-16T10:30:00.000Z',
          },
        ],
      },
    },
  })
  async bulkMarkMatchPaymentPaid(
    @Body() dto: BulkMarkMatchPaymentPaidDto,
  ): Promise<{ updated: number; payments: MatchPaymentResponseDto[] }> {
    return this.fundsService.bulkMarkMatchPaymentPaid(dto.userIds, dto.matchId);
  }

  @Delete('match-payments/:id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa match payment' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMatchPayment(@Param('id') id: string): Promise<void> {
    return this.fundsService.deleteMatchPayment(id);
  }

  @Post('expenses')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo chi phí' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu đã thanh toán phí tháng (1 user)' })
  async markMonthlyFeePaid(
    @Param('id') id: string,
  ): Promise<MonthlyFeeResponseDto> {
    return this.fundsService.markMonthlyFeePaid(id);
  }

  @Post('monthly-fees/bulk/mark-paid')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đánh dấu đã thanh toán phí tháng hàng loạt' })
  @ApiResponse({
    status: 200,
    description: 'Đánh dấu thành công',
    schema: {
      example: {
        updated: 2,
        fees: [
          {
            id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439012',
            userName: 'Nguyễn Văn A',
            month: 1,
            year: 2025,
            amount: 200000,
            isPaid: true,
            paidAt: '2025-01-16T10:30:00.000Z',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-16T10:30:00.000Z',
          },
        ],
      },
    },
  })
  async bulkMarkMonthlyFeePaid(
    @Body() dto: BulkMarkMonthlyFeePaidDto,
  ): Promise<{ updated: number; fees: MonthlyFeeResponseDto[] }> {
    return this.fundsService.bulkMarkMonthlyFeePaid(
      dto.userIds,
      dto.month,
      dto.year,
    );
  }

  @Post('monthly-fees/pay')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo và đánh dấu đã thanh toán phí tháng' })
  async createAndPayMonthlyFee(
    @Body() dto: CreateAndPayMonthlyFeeDto,
  ): Promise<MonthlyFeeResponseDto> {
    return this.fundsService.createAndPayMonthlyFee(dto);
  }

  @Delete('monthly-fees/:id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa phí tháng' })
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

  // ==================== FUND BALANCE MANAGEMENT ====================

  @Post('admin/balance')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Set fund balance',
    description: 'Admin sets the initial fund balance (usually from Excel migration). Only do this once during migration.'
  })
  @ApiResponse({ status: 201, description: 'Fund balance set successfully', type: FundBalanceResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async setFundBalance(
    @Body() dto: SetFundBalanceDto,
    @CurrentUser('_id') adminUserId: string,
  ): Promise<FundBalanceResponseDto> {
    return this.fundsService.setFundBalance(dto, adminUserId);
  }

  @Get('admin/balance')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get fund balance history',
    description: 'Get the most recent fund balance set by admin (audit trail)'
  })
  @ApiResponse({ status: 200, description: 'Fund balance retrieved successfully', type: FundBalanceResponseDto })
  @ApiResponse({ status: 404, description: 'No fund balance has been set' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async getFundBalance(): Promise<FundBalanceResponseDto> {
    return this.fundsService.getCurrentFundBalance();
  }
}
