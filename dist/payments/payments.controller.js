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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_js_1 = require("./payments.service.js");
const create_payment_dto_js_1 = require("./dto/create-payment.dto.js");
const payment_callback_dto_js_1 = require("./dto/payment-callback.dto.js");
const admin_confirm_payment_dto_js_1 = require("./dto/admin-confirm-payment.dto.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async create(createDto) {
        return this.paymentsService.create(createDto);
    }
    async findAll() {
        return this.paymentsService.findAll();
    }
    async findMyPayments(user) {
        return this.paymentsService.findByUser(user.sub);
    }
    async getMySummary(user) {
        return this.paymentsService.getUserSummary(user.sub);
    }
    async findOne(id) {
        return this.paymentsService.findById(id);
    }
    async createVnpayPayment(id, req) {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            '127.0.0.1';
        return this.paymentsService.createVnpayPayment(id, ipAddr);
    }
    async createMomoPayment(id) {
        return this.paymentsService.createMomoPayment(id);
    }
    async createBankTransferPayment(id) {
        return this.paymentsService.createBankTransferPayment(id);
    }
    async vnpayCallback(callback) {
        return this.paymentsService.handleVnpayCallback(callback);
    }
    async momoCallback(callback) {
        return this.paymentsService.handleMomoCallback(callback);
    }
    async cassoWebhook(webhook) {
        return this.paymentsService.handleCassoWebhook(webhook);
    }
    async cancelPayment(id) {
        return this.paymentsService.cancelPayment(id);
    }
    async adminConfirmPayment(id, confirmDto) {
        return this.paymentsService.adminConfirmPayment(id, confirmDto);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_js_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-payments'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findMyPayments", null);
__decorate([
    (0, common_1.Get)('my-summary'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMySummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/vnpay'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createVnpayPayment", null);
__decorate([
    (0, common_1.Post)(':id/momo'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createMomoPayment", null);
__decorate([
    (0, common_1.Post)(':id/bank-transfer'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createBankTransferPayment", null);
__decorate([
    (0, common_1.Get)('callback/vnpay'),
    (0, public_decorator_js_1.Public)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_callback_dto_js_1.VnpayCallbackDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "vnpayCallback", null);
__decorate([
    (0, common_1.Post)('callback/momo'),
    (0, public_decorator_js_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_callback_dto_js_1.MomoCallbackDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "momoCallback", null);
__decorate([
    (0, common_1.Post)('webhook/casso'),
    (0, public_decorator_js_1.Public)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_callback_dto_js_1.CassoWebhookDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "cassoWebhook", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "cancelPayment", null);
__decorate([
    (0, common_1.Patch)(':id/confirm'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_confirm_payment_dto_js_1.AdminConfirmPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "adminConfirmPayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    __metadata("design:paramtypes", [payments_service_js_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map