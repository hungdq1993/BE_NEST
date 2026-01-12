export declare enum NotificationType {
    VOTE_OPENED = "vote_opened",
    VOTE_REMINDER = "vote_reminder",
    VOTE_CLOSED = "vote_closed",
    MATCH_SCHEDULED = "match_scheduled",
    MATCH_REMINDER = "match_reminder",
    MATCH_RESULT = "match_result",
    TEAM_ASSIGNED = "team_assigned",
    PAYMENT_DUE = "payment_due",
    PAYMENT_RECEIVED = "payment_received",
    PENALTY_ISSUED = "penalty_issued",
    GENERAL = "general"
}
export declare class SendNotificationDto {
    type: NotificationType;
    title: string;
    message: string;
    userIds?: string[];
    data?: string;
}
export declare class NotificationResponseDto {
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    sentAt: Date;
}
export declare class BroadcastNotificationDto {
    type: NotificationType;
    title: string;
    message: string;
    data?: string;
}
