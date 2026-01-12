"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ONLINE_PAYMENT_METHODS = exports.VALID_STATUS_TRANSITIONS = exports.TERMINAL_STATUSES = exports.PAYMENT_METHOD_DISPLAY = exports.PAYMENT_TYPE_DISPLAY = exports.PAYMENT_STATUS_DISPLAY = exports.PaymentMethod = exports.PaymentType = exports.PaymentStatus = void 0;
exports.isTerminalStatus = isTerminalStatus;
exports.isValidStatusTransition = isValidStatusTransition;
exports.isOnlinePaymentMethod = isOnlinePaymentMethod;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["CANCELLED"] = "cancelled";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["MATCH_FEE"] = "match_fee";
    PaymentType["MONTHLY_FEE"] = "monthly_fee";
    PaymentType["PENALTY"] = "penalty";
    PaymentType["OTHER"] = "other";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["VNPAY"] = "vnpay";
    PaymentMethod["MOMO"] = "momo";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["CASH"] = "cash";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
exports.PAYMENT_STATUS_DISPLAY = {
    [PaymentStatus.PENDING]: 'Chờ thanh toán',
    [PaymentStatus.COMPLETED]: 'Đã thanh toán',
    [PaymentStatus.FAILED]: 'Thất bại',
    [PaymentStatus.CANCELLED]: 'Đã hủy',
    [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
};
exports.PAYMENT_TYPE_DISPLAY = {
    [PaymentType.MATCH_FEE]: 'Phí trận đấu',
    [PaymentType.MONTHLY_FEE]: 'Phí tháng',
    [PaymentType.PENALTY]: 'Tiền phạt',
    [PaymentType.OTHER]: 'Khác',
};
exports.PAYMENT_METHOD_DISPLAY = {
    [PaymentMethod.VNPAY]: 'VNPay',
    [PaymentMethod.MOMO]: 'MoMo',
    [PaymentMethod.BANK_TRANSFER]: 'Chuyển khoản',
    [PaymentMethod.CASH]: 'Tiền mặt',
};
exports.TERMINAL_STATUSES = [
    PaymentStatus.COMPLETED,
    PaymentStatus.REFUNDED,
];
function isTerminalStatus(status) {
    return exports.TERMINAL_STATUSES.includes(status);
}
exports.VALID_STATUS_TRANSITIONS = {
    [PaymentStatus.PENDING]: [
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
        PaymentStatus.CANCELLED,
    ],
    [PaymentStatus.COMPLETED]: [PaymentStatus.REFUNDED],
    [PaymentStatus.FAILED]: [PaymentStatus.PENDING],
    [PaymentStatus.CANCELLED]: [],
    [PaymentStatus.REFUNDED]: [],
};
function isValidStatusTransition(currentStatus, newStatus) {
    return exports.VALID_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}
exports.ONLINE_PAYMENT_METHODS = [
    PaymentMethod.VNPAY,
    PaymentMethod.MOMO,
];
function isOnlinePaymentMethod(method) {
    return exports.ONLINE_PAYMENT_METHODS.includes(method);
}
//# sourceMappingURL=payment-status.constant.js.map