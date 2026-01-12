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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllDebtsDto = exports.DebtItemDto = exports.UsersStatisticsDto = exports.UserStatisticsItemDto = exports.MonthlyFeePeriodStatusDto = exports.BulkCreateMonthlyFeeDto = exports.CreatePenaltyDto = exports.CreateAndPayMonthlyFeeDto = exports.CreateMonthlyFeeDto = exports.UserDebtDetailDto = exports.UserFundSummaryDto = exports.FundStatsDto = exports.MonthlyFeeResponseDto = void 0;
const class_validator_1 = require("class-validator");
class MonthlyFeeResponseDto {
    id;
    userId;
    userName;
    month;
    year;
    amount;
    isPaid;
    paidAt;
    note;
    createdAt;
    updatedAt;
}
exports.MonthlyFeeResponseDto = MonthlyFeeResponseDto;
class FundStatsDto {
    totalCollected;
    totalPending;
    monthlyFeeStats;
    penaltyStats;
}
exports.FundStatsDto = FundStatsDto;
class UserFundSummaryDto {
    userId;
    userName;
    totalMonthlyFees;
    paidMonthlyFees;
    pendingMonthlyFees;
    totalPenalties;
    paidPenalties;
    pendingPenalties;
    totalMatchPayments;
    paidMatchPayments;
    pendingMatchPayments;
    totalOwed;
    totalPaid;
}
exports.UserFundSummaryDto = UserFundSummaryDto;
class UserDebtDetailDto {
    userId;
    userName;
    totalOwed;
    totalPaid;
    unpaidMonthlyFees;
    unpaidMatchPayments;
    unpaidPenalties;
}
exports.UserDebtDetailDto = UserDebtDetailDto;
class CreateMonthlyFeeDto {
    userId;
    month;
    year;
    amount;
    note;
}
exports.CreateMonthlyFeeDto = CreateMonthlyFeeDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMonthlyFeeDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], CreateMonthlyFeeDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], CreateMonthlyFeeDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMonthlyFeeDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMonthlyFeeDto.prototype, "note", void 0);
class CreateAndPayMonthlyFeeDto {
    userId;
    month;
    year;
    amount;
    note;
}
exports.CreateAndPayMonthlyFeeDto = CreateAndPayMonthlyFeeDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAndPayMonthlyFeeDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], CreateAndPayMonthlyFeeDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], CreateAndPayMonthlyFeeDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAndPayMonthlyFeeDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAndPayMonthlyFeeDto.prototype, "note", void 0);
class CreatePenaltyDto {
    userId;
    matchId;
    amount;
    reason;
    description;
}
exports.CreatePenaltyDto = CreatePenaltyDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePenaltyDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePenaltyDto.prototype, "matchId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePenaltyDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreatePenaltyDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePenaltyDto.prototype, "description", void 0);
class BulkCreateMonthlyFeeDto {
    month;
    year;
    amount;
    note;
}
exports.BulkCreateMonthlyFeeDto = BulkCreateMonthlyFeeDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], BulkCreateMonthlyFeeDto.prototype, "month", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], BulkCreateMonthlyFeeDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], BulkCreateMonthlyFeeDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkCreateMonthlyFeeDto.prototype, "note", void 0);
class MonthlyFeePeriodStatusDto {
    month;
    year;
    totalUsers;
    paidUsers;
    unpaidUsers;
    totalAmount;
    paidAmount;
    unpaidAmount;
    totalUnpaidAllMonths;
}
exports.MonthlyFeePeriodStatusDto = MonthlyFeePeriodStatusDto;
class UserStatisticsItemDto {
    userId;
    userName;
    email;
    role;
    skillLevel;
    isActive;
    totalOwed;
    totalPaid;
    pendingMonthlyFees;
    pendingPenalties;
    pendingMatchPayments;
    losingMatchesCount;
    totalMonthlyFees;
    paidMonthlyFees;
    unpaidMonthlyFees;
    totalPenalties;
    paidPenalties;
    unpaidPenalties;
    totalMatchPayments;
    paidMatchPayments;
    unpaidMatchPayments;
}
exports.UserStatisticsItemDto = UserStatisticsItemDto;
class UsersStatisticsDto {
    totalUsers;
    users;
    summary;
}
exports.UsersStatisticsDto = UsersStatisticsDto;
class DebtItemDto {
    id;
    type;
    userId;
    userName;
    amount;
    createdAt;
    month;
    year;
    note;
    matchId;
    matchDate;
    reason;
    description;
    matchLocation;
}
exports.DebtItemDto = DebtItemDto;
class AllDebtsDto {
    totalDebts;
    totalAmount;
    debts;
    summary;
}
exports.AllDebtsDto = AllDebtsDto;
//# sourceMappingURL=fund-stats.dto.js.map