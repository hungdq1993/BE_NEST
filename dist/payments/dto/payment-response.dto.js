"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSummaryDto = exports.PaymentUrlResponseDto = exports.PaymentResponseDto = void 0;
class PaymentResponseDto {
    id;
    userId;
    userName;
    amount;
    type;
    status;
    method;
    transactionId;
    referenceId;
    referenceModel;
    description;
    paidAt;
    createdAt;
    updatedAt;
}
exports.PaymentResponseDto = PaymentResponseDto;
class PaymentUrlResponseDto {
    paymentId;
    paymentUrl;
}
exports.PaymentUrlResponseDto = PaymentUrlResponseDto;
class PaymentSummaryDto {
    totalAmount;
    paidAmount;
    pendingAmount;
    paymentCount;
}
exports.PaymentSummaryDto = PaymentSummaryDto;
//# sourceMappingURL=payment-response.dto.js.map