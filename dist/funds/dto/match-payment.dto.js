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
exports.MatchDetailWithPaymentsDto = exports.MemberPaymentSummaryDto = exports.MatchPaymentSummaryDto = exports.MatchPaymentResponseDto = exports.PlayerPaymentDto = exports.BulkCreateMatchPaymentDto = exports.CreateMatchPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateMatchPaymentDto {
    userId;
    matchId;
    amount;
    isPaid;
    note;
}
exports.CreateMatchPaymentDto = CreateMatchPaymentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchPaymentDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMatchPaymentDto.prototype, "matchId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMatchPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMatchPaymentDto.prototype, "isPaid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatchPaymentDto.prototype, "note", void 0);
class BulkCreateMatchPaymentDto {
    matchId;
    players;
}
exports.BulkCreateMatchPaymentDto = BulkCreateMatchPaymentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkCreateMatchPaymentDto.prototype, "matchId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PlayerPaymentDto),
    __metadata("design:type", Array)
], BulkCreateMatchPaymentDto.prototype, "players", void 0);
class PlayerPaymentDto {
    userId;
    amount;
    isPaid;
}
exports.PlayerPaymentDto = PlayerPaymentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayerPaymentDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PlayerPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PlayerPaymentDto.prototype, "isPaid", void 0);
class MatchPaymentResponseDto {
    id;
    userId;
    userName;
    matchId;
    matchDate;
    amount;
    isPaid;
    paidAt;
    note;
    createdAt;
    updatedAt;
}
exports.MatchPaymentResponseDto = MatchPaymentResponseDto;
class MatchPaymentSummaryDto {
    matchId;
    matchDate;
    totalAmount;
    paidAmount;
    unpaidAmount;
    playerCount;
    paidCount;
    payments;
}
exports.MatchPaymentSummaryDto = MatchPaymentSummaryDto;
class MemberPaymentSummaryDto {
    userId;
    userName;
    totalMatches;
    totalAmount;
    paidAmount;
    unpaidAmount;
    payments;
}
exports.MemberPaymentSummaryDto = MemberPaymentSummaryDto;
class MatchDetailWithPaymentsDto {
    matchId;
    matchDate;
    location;
    status;
    matchFee;
    result;
    winningTeam;
    teamA;
    teamB;
    losingTeamPlayers;
    notes;
    createdAt;
    updatedAt;
}
exports.MatchDetailWithPaymentsDto = MatchDetailWithPaymentsDto;
//# sourceMappingURL=match-payment.dto.js.map