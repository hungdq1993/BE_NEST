"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenaltyByReasonDto = exports.PenaltySummaryDto = exports.PenaltyResponseDto = void 0;
class PenaltyResponseDto {
    id;
    userId;
    userName;
    matchId;
    matchDate;
    amount;
    reason;
    description;
    isPaid;
    paidAt;
    createdAt;
    updatedAt;
}
exports.PenaltyResponseDto = PenaltyResponseDto;
class PenaltySummaryDto {
    userId;
    userName;
    totalPenalties;
    paidAmount;
    pendingAmount;
    penaltyCount;
    penalties;
}
exports.PenaltySummaryDto = PenaltySummaryDto;
class PenaltyByReasonDto {
    reason;
    count;
    totalAmount;
    paidAmount;
    pendingAmount;
}
exports.PenaltyByReasonDto = PenaltyByReasonDto;
//# sourceMappingURL=penalty-summary.dto.js.map