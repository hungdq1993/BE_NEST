import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway.js';
import {
  SendNotificationDto,
  NotificationResponseDto,
  NotificationType,
  BroadcastNotificationDto,
} from './dto/send-notification.dto.js';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  /**
   * Send notification to specific users via WebSocket
   */
  async sendToUsers(
    dto: SendNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification: NotificationResponseDto = {
      type: dto.type,
      title: dto.title,
      message: dto.message,
      data: dto.data ? JSON.parse(dto.data) : undefined,
      sentAt: new Date(),
    };

    if (dto.userIds && dto.userIds.length > 0) {
      this.notificationsGateway.sendToUsers(dto.userIds, notification);
    }

    this.logger.log(
      `Notification sent to ${dto.userIds?.length || 0} users: ${dto.title}`,
    );

    return notification;
  }

  /**
   * Broadcast notification to all connected users
   */
  async broadcast(
    dto: BroadcastNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification: NotificationResponseDto = {
      type: dto.type,
      title: dto.title,
      message: dto.message,
      data: dto.data ? JSON.parse(dto.data) : undefined,
      sentAt: new Date(),
    };

    this.notificationsGateway.broadcast(notification);

    this.logger.log(`Broadcast notification: ${dto.title}`);

    return notification;
  }

  /**
   * Send vote opened notification
   */
  async notifyVoteOpened(
    userIds: string[],
    sessionId: string,
    matchDate: Date,
    deadline: Date,
  ): Promise<void> {
    await this.sendToUsers({
      type: NotificationType.VOTE_OPENED,
      title: 'Phiên vote mới',
      message: `Phiên vote cho trận đấu ngày ${matchDate.toLocaleDateString('vi-VN')} đã mở. Hạn vote: ${deadline.toLocaleDateString('vi-VN')}`,
      userIds,
      data: JSON.stringify({ sessionId, matchDate, deadline }),
    });
  }

  /**
   * Send vote reminder notification
   */
  async notifyVoteReminder(
    userIds: string[],
    sessionId: string,
    deadline: Date,
  ): Promise<void> {
    await this.sendToUsers({
      type: NotificationType.VOTE_REMINDER,
      title: 'Nhắc nhở vote',
      message: `Bạn chưa vote cho trận đấu sắp tới. Hạn vote: ${deadline.toLocaleDateString('vi-VN')}`,
      userIds,
      data: JSON.stringify({ sessionId, deadline }),
    });
  }

  /**
   * Send team assignment notification
   */
  async notifyTeamAssigned(
    userIds: string[],
    matchId: string,
    team: 'A' | 'B',
    matchDate: Date,
  ): Promise<void> {
    await this.sendToUsers({
      type: NotificationType.TEAM_ASSIGNED,
      title: 'Phân đội',
      message: `Bạn được xếp vào đội ${team} cho trận đấu ngày ${matchDate.toLocaleDateString('vi-VN')}`,
      userIds,
      data: JSON.stringify({ matchId, team, matchDate }),
    });
  }

  /**
   * Send match result notification
   */
  async notifyMatchResult(
    matchId: string,
    teamAScore: number,
    teamBScore: number,
  ): Promise<void> {
    await this.broadcast({
      type: NotificationType.MATCH_RESULT,
      title: 'Kết quả trận đấu',
      message: `Kết quả: Đội A ${teamAScore} - ${teamBScore} Đội B`,
      data: JSON.stringify({ matchId, teamAScore, teamBScore }),
    });
  }

  /**
   * Send payment due notification
   */
  async notifyPaymentDue(
    userIds: string[],
    amount: number,
    dueDate: Date,
  ): Promise<void> {
    await this.sendToUsers({
      type: NotificationType.PAYMENT_DUE,
      title: 'Nhắc nhở thanh toán',
      message: `Bạn có khoản thanh toán ${amount.toLocaleString('vi-VN')}đ cần thanh toán trước ${dueDate.toLocaleDateString('vi-VN')}`,
      userIds,
      data: JSON.stringify({ amount, dueDate }),
    });
  }

  /**
   * Send penalty notification
   */
  async notifyPenaltyIssued(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<void> {
    await this.sendToUsers({
      type: NotificationType.PENALTY_ISSUED,
      title: 'Phạt',
      message: `Bạn bị phạt ${amount.toLocaleString('vi-VN')}đ. Lý do: ${reason}`,
      userIds: [userId],
      data: JSON.stringify({ amount, reason }),
    });
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.notificationsGateway.isUserOnline(userId);
  }

  /**
   * Get online users count
   */
  getOnlineUsersCount(): number {
    return this.notificationsGateway.getOnlineUsersCount();
  }
}
