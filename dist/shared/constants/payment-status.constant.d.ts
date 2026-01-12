export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentType {
    MATCH_FEE = "match_fee",
    MONTHLY_FEE = "monthly_fee",
    PENALTY = "penalty",
    OTHER = "other"
}
export declare enum PaymentMethod {
    VNPAY = "vnpay",
    MOMO = "momo",
    BANK_TRANSFER = "bank_transfer",
    CASH = "cash"
}
export declare const PAYMENT_STATUS_DISPLAY: Record<PaymentStatus, string>;
export declare const PAYMENT_TYPE_DISPLAY: Record<PaymentType, string>;
export declare const PAYMENT_METHOD_DISPLAY: Record<PaymentMethod, string>;
export declare const TERMINAL_STATUSES: PaymentStatus[];
export declare function isTerminalStatus(status: PaymentStatus): boolean;
export declare const VALID_STATUS_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]>;
export declare function isValidStatusTransition(currentStatus: PaymentStatus, newStatus: PaymentStatus): boolean;
export declare const ONLINE_PAYMENT_METHODS: PaymentMethod[];
export declare function isOnlinePaymentMethod(method: PaymentMethod): boolean;
