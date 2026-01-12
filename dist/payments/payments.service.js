"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const payments_repository_js_1 = require("./payments.repository.js");
const vnpay_service_js_1 = require("./providers/vnpay.service.js");
const momo_service_js_1 = require("./providers/momo.service.js");
const vietqr_service_js_1 = require("./providers/vietqr.service.js");
const casso_service_js_1 = require("./providers/casso.service.js");
const payment_schema_js_1 = require("./schemas/payment.schema.js");
const config_1 = require("@nestjs/config");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    paymentsRepository;
    vnpayService;
    momoService;
    vietQrService;
    cassoService;
    configService;
    logger = new common_1.Logger(PaymentsService_1.name);
    returnUrl;
    notifyUrl;
    constructor(paymentsRepository, vnpayService, momoService, vietQrService, cassoService, configService) {
        this.paymentsRepository = paymentsRepository;
        this.vnpayService = vnpayService;
        this.momoService = momoService;
        this.vietQrService = vietQrService;
        this.cassoService = cassoService;
        this.configService = configService;
        this.returnUrl = this.configService.get('PAYMENT_RETURN_URL', 'http://localhost:3000/payment/callback');
        this.notifyUrl = this.configService.get('PAYMENT_NOTIFY_URL', 'http://localhost:3001/api/payments/notify');
    }
    async create(createDto) {
        const payment = await this.paymentsRepository.create(createDto);
        return this.toResponseDto(payment);
    }
    async findAll() {
        const payments = await this.paymentsRepository.findAll();
        return payments.map((p) => this.toResponseDto(p));
    }
    async findById(id) {
        const payment = await this.paymentsRepository.findById(id);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.toResponseDto(payment);
    }
    async findByUser(userId) {
        const payments = await this.paymentsRepository.findByUser(userId);
        return payments.map((p) => this.toResponseDto(p));
    }
    async createVnpayPayment(paymentId, ipAddr) {
        const payment = await this.paymentsRepository.findById(paymentId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        await this.paymentsRepository.updateStatus(paymentId, payment_schema_js_1.PaymentStatus.PENDING);
        const params = {
            orderId: paymentId,
            amount: payment.amount,
            orderInfo: payment.description || `Payment ${paymentId}`,
            returnUrl: this.returnUrl,
            ipAddr,
        };
        const paymentUrl = this.vnpayService.createPaymentUrl(params);
        return { paymentId, paymentUrl };
    }
    async createMomoPayment(paymentId) {
        const payment = await this.paymentsRepository.findById(paymentId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        await this.paymentsRepository.updateStatus(paymentId, payment_schema_js_1.PaymentStatus.PENDING);
        const params = {
            orderId: paymentId,
            amount: payment.amount,
            orderInfo: payment.description || `Payment ${paymentId}`,
            returnUrl: this.returnUrl,
            notifyUrl: this.notifyUrl,
        };
        const paymentUrl = await this.momoService.createPaymentUrl(params);
        return { paymentId, paymentUrl };
    }
    async handleVnpayCallback(callback) {
        const result = this.vnpayService.verifyCallback(callback);
        const status = result.isValid && result.responseCode === '00'
            ? payment_schema_js_1.PaymentStatus.COMPLETED
            : payment_schema_js_1.PaymentStatus.FAILED;
        const payment = await this.paymentsRepository.updateStatus(callback.vnp_TxnRef, status, callback.vnp_TransactionNo);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.toResponseDto(payment);
    }
    async handleMomoCallback(callback) {
        const result = this.momoService.verifyCallback(callback);
        const status = result.isValid && result.resultCode === '0'
            ? payment_schema_js_1.PaymentStatus.COMPLETED
            : payment_schema_js_1.PaymentStatus.FAILED;
        const payment = await this.paymentsRepository.updateStatus(callback.orderId, status, callback.transId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.toResponseDto(payment);
    }
    async getUserSummary(userId) {
        return this.paymentsRepository.getSummaryByUser(userId);
    }
    async cancelPayment(id) {
        const payment = await this.paymentsRepository.updateStatus(id, payment_schema_js_1.PaymentStatus.CANCELLED);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.toResponseDto(payment);
    }
    async createBankTransferPayment(paymentId) {
        const payment = await this.paymentsRepository.findById(paymentId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        await this.paymentsRepository.updateStatus(paymentId, payment_schema_js_1.PaymentStatus.PENDING);
        const paymentCode = this.cassoService.generatePaymentCode(paymentId);
        const qrResponse = await this.vietQrService.generateQrCode({
            amount: payment.amount,
            description: paymentCode,
        });
        const bankAccountNo = this.configService.get('BANK_ACCOUNT_NO', '');
        const bankAccountName = this.configService.get('BANK_ACCOUNT_NAME', '');
        const bankName = this.configService.get('BANK_NAME', 'ACB Bank');
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
    async handleCassoWebhook(webhook) {
        const result = this.cassoService.verifyWebhook(webhook, webhook.signature);
        if (!result.isValid) {
            throw new common_1.UnauthorizedException('Invalid webhook signature');
        }
        if (!result.paymentId) {
            throw new common_1.BadRequestException('Payment code not found in transaction description');
        }
        const payment = await this.paymentsRepository.findById(result.paymentId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.amount !== result.amount) {
            this.logger.warn(`Amount mismatch for payment ${result.paymentId}: expected ${payment.amount}, got ${result.amount}`);
            const updatedPayment = await this.paymentsRepository.updateStatus(result.paymentId, payment_schema_js_1.PaymentStatus.FAILED, result.transactionId);
            return this.toResponseDto(updatedPayment);
        }
        if (payment.transactionId === result.transactionId) {
            this.logger.log(`Duplicate webhook for payment ${result.paymentId}, transaction ${result.transactionId}`);
            return this.toResponseDto(payment);
        }
        if (payment.status === payment_schema_js_1.PaymentStatus.COMPLETED) {
            this.logger.warn(`Payment ${result.paymentId} already completed, ignoring webhook`);
            return this.toResponseDto(payment);
        }
        const updatedPayment = await this.paymentsRepository.updateStatus(result.paymentId, payment_schema_js_1.PaymentStatus.COMPLETED, result.transactionId);
        return this.toResponseDto(updatedPayment);
    }
    async adminConfirmPayment(paymentId, confirmDto) {
        const payment = await this.paymentsRepository.findById(paymentId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== payment_schema_js_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException(`Cannot confirm payment with status ${payment.status}`);
        }
        const updatedPayment = await this.paymentsRepository.updateStatus(paymentId, payment_schema_js_1.PaymentStatus.COMPLETED, confirmDto.transactionId);
        return this.toResponseDto(updatedPayment);
    }
    toResponseDto(payment) {
        const user = payment.user;
        return {
            id: payment._id.toString(),
            userId: typeof user === 'object' && '_id' in user
                ? user._id.toString()
                : payment.user.toString(),
            userName: typeof user === 'object' && 'name' in user ? user.name : undefined,
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_repository_js_1.PaymentsRepository,
        vnpay_service_js_1.VnpayService,
        momo_service_js_1.MomoService,
        vietqr_service_js_1.VietQrService,
        casso_service_js_1.CassoService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map