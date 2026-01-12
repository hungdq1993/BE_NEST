/**
 * Payment status and type constants for the football management system
 */

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  MATCH_FEE = 'match_fee',
  MONTHLY_FEE = 'monthly_fee',
  PENALTY = 'penalty',
  OTHER = 'other',
}

export enum PaymentMethod {
  VNPAY = 'vnpay',
  MOMO = 'momo',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

/**
 * Payment status display names in Vietnamese
 */
export const PAYMENT_STATUS_DISPLAY: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Chờ thanh toán',
  [PaymentStatus.COMPLETED]: 'Đã thanh toán',
  [PaymentStatus.FAILED]: 'Thất bại',
  [PaymentStatus.CANCELLED]: 'Đã hủy',
  [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
};

/**
 * Payment type display names in Vietnamese
 */
export const PAYMENT_TYPE_DISPLAY: Record<PaymentType, string> = {
  [PaymentType.MATCH_FEE]: 'Phí trận đấu',
  [PaymentType.MONTHLY_FEE]: 'Phí tháng',
  [PaymentType.PENALTY]: 'Tiền phạt',
  [PaymentType.OTHER]: 'Khác',
};

/**
 * Payment method display names in Vietnamese
 */
export const PAYMENT_METHOD_DISPLAY: Record<PaymentMethod, string> = {
  [PaymentMethod.VNPAY]: 'VNPay',
  [PaymentMethod.MOMO]: 'MoMo',
  [PaymentMethod.BANK_TRANSFER]: 'Chuyển khoản',
  [PaymentMethod.CASH]: 'Tiền mặt',
};

/**
 * Terminal payment statuses (cannot be changed)
 */
export const TERMINAL_STATUSES: PaymentStatus[] = [
  PaymentStatus.COMPLETED,
  PaymentStatus.REFUNDED,
];

/**
 * Check if a payment status is terminal
 */
export function isTerminalStatus(status: PaymentStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

/**
 * Valid status transitions
 */
export const VALID_STATUS_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> =
  {
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

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(
  currentStatus: PaymentStatus,
  newStatus: PaymentStatus,
): boolean {
  return VALID_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Online payment methods (require callback handling)
 */
export const ONLINE_PAYMENT_METHODS: PaymentMethod[] = [
  PaymentMethod.VNPAY,
  PaymentMethod.MOMO,
];

/**
 * Check if a payment method is online
 */
export function isOnlinePaymentMethod(method: PaymentMethod): boolean {
  return ONLINE_PAYMENT_METHODS.includes(method);
}
