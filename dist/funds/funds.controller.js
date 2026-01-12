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
exports.FundsController = void 0;
const common_1 = require("@nestjs/common");
const funds_service_js_1 = require("./funds.service.js");
const fund_stats_dto_js_1 = require("./dto/fund-stats.dto.js");
const match_payment_dto_js_1 = require("./dto/match-payment.dto.js");
const expense_dto_js_1 = require("./dto/expense.dto.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
let FundsController = class FundsController {
    fundsService;
    constructor(fundsService) {
        this.fundsService = fundsService;
    }
    async getFundSummary() {
        return this.fundsService.getFundSummary();
    }
    async createMatchPayment(dto) {
        return this.fundsService.createMatchPayment(dto);
    }
    async bulkCreateMatchPayments(dto) {
        return this.fundsService.bulkCreateMatchPayments(dto);
    }
    async findAllMatchPayments(matchId) {
        if (matchId) {
            return this.fundsService.findMatchPaymentsByMatch(matchId);
        }
        return this.fundsService.findAllMatchPayments();
    }
    async findUnpaidMatchPayments() {
        return this.fundsService.findUnpaidMatchPayments();
    }
    async findMatchPaymentsByMatch(matchId) {
        return this.fundsService.findMatchPaymentsByMatch(matchId);
    }
    async markMatchPaymentPaid(id) {
        return this.fundsService.markMatchPaymentPaid(id);
    }
    async deleteMatchPayment(id) {
        return this.fundsService.deleteMatchPayment(id);
    }
    async createExpense(dto) {
        return this.fundsService.createExpense(dto);
    }
    async findAllExpenses(startDate, endDate, category) {
        return this.fundsService.findAllExpenses(startDate, endDate, category);
    }
    async updateExpense(id, dto) {
        return this.fundsService.updateExpense(id, dto);
    }
    async deleteExpense(id) {
        return this.fundsService.deleteExpense(id);
    }
    async createMonthlyFee(dto) {
        return this.fundsService.createMonthlyFee(dto);
    }
    async bulkCreateMonthlyFees(dto) {
        return this.fundsService.bulkCreateMonthlyFees(dto);
    }
    async findAllMonthlyFees() {
        return this.fundsService.findAllMonthlyFees();
    }
    async findUnpaidMonthlyFees() {
        return this.fundsService.findUnpaidMonthlyFees();
    }
    async findMonthlyFeesByPeriod(month, year) {
        return this.fundsService.findMonthlyFeesByPeriod(month, year);
    }
    async getMonthlyFeePeriodStatus(month, year) {
        return this.fundsService.getMonthlyFeePeriodStatus(month, year);
    }
    async markMonthlyFeePaid(id) {
        return this.fundsService.markMonthlyFeePaid(id);
    }
    async createAndPayMonthlyFee(dto) {
        return this.fundsService.createAndPayMonthlyFee(dto);
    }
    async deleteMonthlyFee(id) {
        return this.fundsService.deleteMonthlyFee(id);
    }
    async createPenalty(dto) {
        return this.fundsService.createPenalty(dto);
    }
    async findAllPenalties() {
        return this.fundsService.findAllPenalties();
    }
    async findUnpaidPenalties() {
        return this.fundsService.findUnpaidPenalties();
    }
    async findPenaltiesByMatch(matchId) {
        return this.fundsService.findPenaltiesByMatch(matchId);
    }
    async markPenaltyPaid(id) {
        return this.fundsService.markPenaltyPaid(id);
    }
    async deletePenalty(id) {
        return this.fundsService.deletePenalty(id);
    }
    async getFundStats() {
        return this.fundsService.getFundStats();
    }
    async getAllUsersStatistics() {
        return this.fundsService.getAllUsersStatistics();
    }
    async getUserFundSummary(userId, userName = 'User') {
        return this.fundsService.getUserFundSummary(userId, userName);
    }
    async getAllDebts() {
        return this.fundsService.getAllDebts();
    }
    async getUserDebtDetail(userId, userName = 'User') {
        return this.fundsService.getUserDebtDetail(userId, userName);
    }
    async getMatchDetailWithPayments(matchId) {
        return await this.fundsService.getMatchDetailWithPayments(matchId);
    }
    async processLosingTeam(matchId) {
        return await this.fundsService.processLosingTeam(matchId);
    }
};
exports.FundsController = FundsController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getFundSummary", null);
__decorate([
    (0, common_1.Post)('match-payments'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_payment_dto_js_1.CreateMatchPaymentDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "createMatchPayment", null);
__decorate([
    (0, common_1.Post)('match-payments/bulk'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_payment_dto_js_1.BulkCreateMatchPaymentDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "bulkCreateMatchPayments", null);
__decorate([
    (0, common_1.Get)('match-payments'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findAllMatchPayments", null);
__decorate([
    (0, common_1.Get)('match-payments/unpaid'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findUnpaidMatchPayments", null);
__decorate([
    (0, common_1.Get)('match-payments/match/:matchId'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findMatchPaymentsByMatch", null);
__decorate([
    (0, common_1.Patch)('match-payments/:id/pay'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "markMatchPaymentPaid", null);
__decorate([
    (0, common_1.Delete)('match-payments/:id'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "deleteMatchPayment", null);
__decorate([
    (0, common_1.Post)('expenses'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [expense_dto_js_1.CreateExpenseDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)('expenses'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findAllExpenses", null);
__decorate([
    (0, common_1.Put)('expenses/:id'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, expense_dto_js_1.UpdateExpenseDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "deleteExpense", null);
__decorate([
    (0, common_1.Post)('monthly-fees'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fund_stats_dto_js_1.CreateMonthlyFeeDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "createMonthlyFee", null);
__decorate([
    (0, common_1.Post)('monthly-fees/bulk'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fund_stats_dto_js_1.BulkCreateMonthlyFeeDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "bulkCreateMonthlyFees", null);
__decorate([
    (0, common_1.Get)('monthly-fees'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findAllMonthlyFees", null);
__decorate([
    (0, common_1.Get)('monthly-fees/unpaid'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findUnpaidMonthlyFees", null);
__decorate([
    (0, common_1.Get)('monthly-fees/period'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findMonthlyFeesByPeriod", null);
__decorate([
    (0, common_1.Get)('monthly-fees/period/status'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getMonthlyFeePeriodStatus", null);
__decorate([
    (0, common_1.Patch)('monthly-fees/:id/pay'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "markMonthlyFeePaid", null);
__decorate([
    (0, common_1.Post)('monthly-fees/pay'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fund_stats_dto_js_1.CreateAndPayMonthlyFeeDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "createAndPayMonthlyFee", null);
__decorate([
    (0, common_1.Delete)('monthly-fees/:id'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "deleteMonthlyFee", null);
__decorate([
    (0, common_1.Post)('penalties'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fund_stats_dto_js_1.CreatePenaltyDto]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "createPenalty", null);
__decorate([
    (0, common_1.Get)('penalties'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findAllPenalties", null);
__decorate([
    (0, common_1.Get)('penalties/unpaid'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findUnpaidPenalties", null);
__decorate([
    (0, common_1.Get)('penalties/match/:matchId'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "findPenaltiesByMatch", null);
__decorate([
    (0, common_1.Patch)('penalties/:id/pay'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "markPenaltyPaid", null);
__decorate([
    (0, common_1.Delete)('penalties/:id'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "deletePenalty", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getFundStats", null);
__decorate([
    (0, common_1.Get)('users-statistics'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getAllUsersStatistics", null);
__decorate([
    (0, common_1.Get)('user-summary/:userId'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getUserFundSummary", null);
__decorate([
    (0, common_1.Get)('debts'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getAllDebts", null);
__decorate([
    (0, common_1.Get)('user-debt/:userId'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getUserDebtDetail", null);
__decorate([
    (0, common_1.Get)('matches/:matchId'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "getMatchDetailWithPayments", null);
__decorate([
    (0, common_1.Post)('matches/:matchId/process-losing-team'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('matchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FundsController.prototype, "processLosingTeam", null);
exports.FundsController = FundsController = __decorate([
    (0, common_1.Controller)('funds'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    __metadata("design:paramtypes", [funds_service_js_1.FundsService])
], FundsController);
//# sourceMappingURL=funds.controller.js.map