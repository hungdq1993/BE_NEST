import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PaymentsRepository } from './payments.repository.js';
import { VnpayService, VnpayPaymentParams } from './providers/vnpay.service.js';
import { MomoService, MomoPaymentParams } from './providers/momo.service.js';
import { VietQrService } from './providers/vietqr.service.js';
import { CassoService } from './providers/casso.service.js';
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
import { PaymentDocument, PaymentStatus } from './schemas/payment.schema.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly returnUrl: string;
  private readonly notifyUrl: string;

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly vnpayService: VnpayService,
    private readonly momoService: MomoService,
    private readonly vietQrService: VietQrService,
    private readonly cassoService: CassoService,
    private readonly configService: ConfigService,
  ) {
    this.returnUrl = this.configService.get<string>(
      'PAYMENT_RETURN_URL',
      'http://localhost:3000/payment/callback',
    );
    this.notifyUrl = this.configService.get<string>(
      'PAYMENT_NOTIFY_URL',
      'http://localhost:3001/api/payments/notify',
    );
  }

  async create(createDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentsRepository.create(createDto);
    return this.toResponseDto(payment);
  }

  async findAll(): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentsRepository.findAll();
    return payments.map((p) => this.toResponseDto(p));
  }

  async findById(id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentsRepository.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return this.toResponseDto(payment);
  }

  async findByUser(userId: string): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentsRepository.findByUser(userId);
    return payments.map((p) => this.toResponseDto(p));
  }

  async createVnpayPayment(
    paymentId: string,
    ipAddr: string,
  ): Promise<PaymentUrlResponseDto> {
    const payment = await this.paymentsRepository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.paymentsRepository.updateStatus(
      paymentId,
      PaymentStatus.PENDING,
    );

    const params: VnpayPaymentParams = {
      orderId: paymentId,
      amount: payment.amount,
      orderInfo: payment.description || `Payment ${paymentId}`,
      returnUrl: this.returnUrl,
      ipAddr,
    };

    const paymentUrl = this.vnpayService.createPaymentUrl(params);
    return { paymentId, paymentUrl };
  }

  async createMomoPayment(paymentId: string): Promise<PaymentUrlResponseDto> {
    const payment = await this.paymentsRepository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.paymentsRepository.updateStatus(
      paymentId,
      PaymentStatus.PENDING,
    );

    const params: MomoPaymentParams = {
      orderId: paymentId,
      amount: payment.amount,
      orderInfo: payment.description || `Payment ${paymentId}`,
      returnUrl: this.returnUrl,
      notifyUrl: this.notifyUrl,
    };

    const paymentUrl = await this.momoService.createPaymentUrl(params);
    return { paymentId, paymentUrl };
  }

  async handleVnpayCallback(
    callback: VnpayCallbackDto,
  ): Promise<PaymentResponseDto> {
    const result = this.vnpayService.verifyCallback(callback as any);

    const status =
      result.isValid && result.responseCode === '00'
        ? PaymentStatus.COMPLETED
        : PaymentStatus.FAILED;

    const payment = await this.paymentsRepository.updateStatus(
      callback.vnp_TxnRef,
      status,
      callback.vnp_TransactionNo,
    );

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.toResponseDto(payment);
  }

  async handleMomoCallback(
    callback: MomoCallbackDto,
  ): Promise<PaymentResponseDto> {
    const result = this.momoService.verifyCallback(callback as any);

    const status =
      result.isValid && result.resultCode === '0'
        ? PaymentStatus.COMPLETED
        : PaymentStatus.FAILED;

    const payment = await this.paymentsRepository.updateStatus(
      callback.orderId,
      status,
      callback.transId,
    );

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.toResponseDto(payment);
  }

  async getUserSummary(userId: string): Promise<PaymentSummaryDto> {
    return this.paymentsRepository.getSummaryByUser(userId);
  }

  async cancelPayment(id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentsRepository.updateStatus(
      id,
      PaymentStatus.CANCELLED,
    );
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return this.toResponseDto(payment);
  }

  async createBankTransferPayment(
    paymentId: string,
  ): Promise<BankTransferResponseDto> {
    const payment = await this.paymentsRepository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update status to PENDING
    await this.paymentsRepository.updateStatus(
      paymentId,
      PaymentStatus.PENDING,
    );

    // Generate payment code
    const paymentCode = this.cassoService.generatePaymentCode(paymentId);

    // Generate QR code via VietQR
    const qrResponse = await this.vietQrService.generateQrCode({
      amount: payment.amount,
      description: paymentCode,
    });

    // Get bank details from config
    const bankAccountNo = this.configService.get<string>('BANK_ACCOUNT_NO', '');
    const bankAccountName = this.configService.get<string>(
      'BANK_ACCOUNT_NAME',
      '',
    );
    const bankName = this.configService.get<string>('BANK_NAME', 'ACB Bank');

    return {
      paymentId,
      paymentCode,
      qrCodeBase64: qrResponse.data.qrCode,
      qrDataUrl: qrResponse.data.qrDataURL,
      bankAccountNo,
      bankAccountName,
      bankName,
      amount: payment.amount,
      description: paymentCode,
    };
  }

  async handleCassoWebhook(
    webhook: CassoWebhookDto,
  ): Promise<PaymentResponseDto> {
    // Verify webhook signature
    const result = this.cassoService.verifyWebhook(webhook, webhook.signature);

    if (!result.isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    if (!result.paymentId) {
      throw new BadRequestException(
        'Payment code not found in transaction description',
      );
    }

    // Check if payment exists
    const payment = await this.paymentsRepository.findById(result.paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify amount matches
    if (payment.amount !== result.amount) {
      this.logger.warn(
        `Amount mismatch for payment ${result.paymentId}: expected ${payment.amount}, got ${result.amount}`,
      );
      const updatedPayment = await this.paymentsRepository.updateStatus(
        result.paymentId,
        PaymentStatus.FAILED,
        result.transactionId,
      );
      return this.toResponseDto(updatedPayment!);
    }

    // Check for duplicate processing (idempotency)
    if (payment.transactionId === result.transactionId) {
      this.logger.log(
        `Duplicate webhook for payment ${result.paymentId}, transaction ${result.transactionId}`,
      );
      return this.toResponseDto(payment);
    }

    // Check if already completed
    if (payment.status === PaymentStatus.COMPLETED) {
      this.logger.warn(
        `Payment ${result.paymentId} already completed, ignoring webhook`,
      );
      return this.toResponseDto(payment);
    }

    // Update payment status to COMPLETED
    const updatedPayment = await this.paymentsRepository.updateStatus(
      result.paymentId,
      PaymentStatus.COMPLETED,
      result.transactionId,
    );

    return this.toResponseDto(updatedPayment!);
  }

  async adminConfirmPayment(
    paymentId: string,
    confirmDto: AdminConfirmPaymentDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsRepository.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Only allow confirming PENDING payments
    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        `Cannot confirm payment with status ${payment.status}`,
      );
    }

    // Update to COMPLETED with optional transaction ID
    const updatedPayment = await this.paymentsRepository.updateStatus(
      paymentId,
      PaymentStatus.COMPLETED,
      confirmDto.transactionId,
    );

    return this.toResponseDto(updatedPayment!);
  }

  private toResponseDto(payment: PaymentDocument): PaymentResponseDto {
    const user = payment.user as any;
    return {
      id: payment._id.toString(),
      userId:
        typeof user === 'object' && '_id' in user
          ? user._id.toString()
          : payment.user.toString(),
      userName:
        typeof user === 'object' && 'name' in user ? user.name : undefined,
      amount: payment.amount,
      type: payment.type,
      status: payment.status,
      method: payment.method,
      transactionId: payment.transactionId,
      referenceId: payment.reference?.toString(),
      referenceModel: payment.referenceModel,
      description: payment.description,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
