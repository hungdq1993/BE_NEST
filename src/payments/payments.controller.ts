import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import {
  VnpayCallbackDto,
  MomoCallbackDto,
  CassoWebhookDto,
} from './dto/payment-callback.dto.js';
import {
  PaymentResponseDto,
  PaymentUrlResponseDto,
  PaymentSummaryDto,
} from './dto/payment-response.dto.js';
import { BankTransferResponseDto } from './dto/bank-transfer-response.dto.js';
import { AdminConfirmPaymentDto } from './dto/admin-confirm-payment.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, Role } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ==================== PUBLIC VIEW APIs ====================

  @Public()
  @Get()
  async findAll(): Promise<PaymentResponseDto[]> {
    return this.paymentsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.paymentsService.findById(id);
  }

  // ==================== WEBHOOK/CALLBACK APIs (External Services) ====================

  @Get('callback/vnpay')
  @Public()
  async vnpayCallback(
    @Query() callback: VnpayCallbackDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.handleVnpayCallback(callback);
  }

  @Post('callback/momo')
  @Public()
  @HttpCode(HttpStatus.OK)
  async momoCallback(
    @Body() callback: MomoCallbackDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.handleMomoCallback(callback);
  }

  @Post('webhook/casso')
  @Public()
  @HttpCode(HttpStatus.OK)
  async cassoWebhook(
    @Body() webhook: CassoWebhookDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.handleCassoWebhook(webhook);
  }

  // ==================== AUTHENTICATED USER APIs ====================

  @Get('my-payments')
  async findMyPayments(
    @CurrentUser() user: any,
  ): Promise<PaymentResponseDto[]> {
    return this.paymentsService.findByUser(user.sub);
  }

  @Get('my-summary')
  async getMySummary(@CurrentUser() user: any): Promise<PaymentSummaryDto> {
    return this.paymentsService.getUserSummary(user.sub);
  }

  @Post(':id/vnpay')
  async createVnpayPayment(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<PaymentUrlResponseDto> {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    return this.paymentsService.createVnpayPayment(id, ipAddr);
  }

  @Post(':id/momo')
  async createMomoPayment(
    @Param('id') id: string,
  ): Promise<PaymentUrlResponseDto> {
    return this.paymentsService.createMomoPayment(id);
  }

  @Post(':id/bank-transfer')
  async createBankTransferPayment(
    @Param('id') id: string,
  ): Promise<BankTransferResponseDto> {
    return this.paymentsService.createBankTransferPayment(id);
  }

  // ==================== ADMIN ONLY APIs ====================

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.create(createDto);
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN)
  async cancelPayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.paymentsService.cancelPayment(id);
  }

  @Patch(':id/confirm')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async adminConfirmPayment(
    @Param('id') id: string,
    @Body() confirmDto: AdminConfirmPaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.adminConfirmPayment(id, confirmDto);
  }
}
