import { NotificationsGateway } from './notifications.gateway.js';
import { SendNotificationDto, NotificationResponseDto, BroadcastNotificationDto } from './dto/send-notification.dto.js';
export declare class NotificationsService {
    private readonly notificationsGateway;
    private readonly logger;
    constructor(notificationsGateway: NotificationsGateway);
    sendToUsers(dto: SendNotificationDto): Promise<NotificationResponseDto>;
    broadcast(dto: BroadcastNotificationDto): Promise<NotificationResponseDto>;
    notifyVoteOpened(userIds: string[], sessionId: string, matchDate: Date, deadline: Date): Promise<void>;
    notifyVoteReminder(userIds: string[], sessionId: string, deadline: Date): Promise<void>;
    notifyTeamAssigned(userIds: string[], matchId: string, team: 'A' | 'B', matchDate: Date): Promise<void>;
    notifyMatchResult(matchId: string, teamAScore: number, teamBScore: number): Promise<void>;
    notifyPaymentDue(userIds: string[], amount: number, dueDate: Date): Promise<void>;
    notifyPenaltyIssued(userId: string, amount: number, reason: string): Promise<void>;
    isUserOnline(userId: string): boolean;
    getOnlineUsersCount(): number;
}
