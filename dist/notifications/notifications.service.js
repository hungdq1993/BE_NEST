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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const notifications_gateway_js_1 = require("./notifications.gateway.js");
const send_notification_dto_js_1 = require("./dto/send-notification.dto.js");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    notificationsGateway;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(notificationsGateway) {
        this.notificationsGateway = notificationsGateway;
    }
    async sendToUsers(dto) {
        const notification = {
            type: dto.type,
            title: dto.title,
            message: dto.message,
            data: dto.data ? JSON.parse(dto.data) : undefined,
            sentAt: new Date(),
        };
        if (dto.userIds && dto.userIds.length > 0) {
            this.notificationsGateway.sendToUsers(dto.userIds, notification);
        }
        this.logger.log(`Notification sent to ${dto.userIds?.length || 0} users: ${dto.title}`);
        return notification;
    }
    async broadcast(dto) {
        const notification = {
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
    async notifyVoteOpened(userIds, sessionId, matchDate, deadline) {
        await this.sendToUsers({
            type: send_notification_dto_js_1.NotificationType.VOTE_OPENED,
            title: 'Phiên vote mới',
            message: `Phiên vote cho trận đấu ngày ${matchDate.toLocaleDateString('vi-VN')} đã mở. Hạn vote: ${deadline.toLocaleDateString('vi-VN')}`,
            userIds,
            data: JSON.stringify({ sessionId, matchDate, deadline }),
        });
    }
    async notifyVoteReminder(userIds, sessionId, deadline) {
        await this.sendToUsers({
            type: send_notification_dto_js_1.NotificationType.VOTE_REMINDER,
            title: 'Nhắc nhở vote',
            message: `Bạn chưa vote cho trận đấu sắp tới. Hạn vote: ${deadline.toLocaleDateString('vi-VN')}`,
            userIds,
            data: JSON.stringify({ sessionId, deadline }),
        });
    }
    async notifyTeamAssigned(userIds, matchId, team, matchDate) {
        await this.sendToUsers({
            type: send_notification_dto_js_1.NotificationType.TEAM_ASSIGNED,
            title: 'Phân đội',
            message: `Bạn được xếp vào đội ${team} cho trận đấu ngày ${matchDate.toLocaleDateString('vi-VN')}`,
            userIds,
            data: JSON.stringify({ matchId, team, matchDate }),
        });
    }
    async notifyMatchResult(matchId, teamAScore, teamBScore) {
        await this.broadcast({
            type: send_notification_dto_js_1.NotificationType.MATCH_RESULT,
            title: 'Kết quả trận đấu',
            message: `Kết quả: Đội A ${teamAScore} - ${teamBScore} Đội B`,
            data: JSON.stringify({ matchId, teamAScore, teamBScore }),
        });
    }
    async notifyPaymentDue(userIds, amount, dueDate) {
        await this.sendToUsers({
            type: send_notification_dto_js_1.NotificationType.PAYMENT_DUE,
            title: 'Nhắc nhở thanh toán',
            message: `Bạn có khoản thanh toán ${amount.toLocaleString('vi-VN')}đ cần thanh toán trước ${dueDate.toLocaleDateString('vi-VN')}`,
            userIds,
            data: JSON.stringify({ amount, dueDate }),
        });
    }
    async notifyPenaltyIssued(userId, amount, reason) {
        await this.sendToUsers({
            type: send_notification_dto_js_1.NotificationType.PENALTY_ISSUED,
            title: 'Phạt',
            message: `Bạn bị phạt ${amount.toLocaleString('vi-VN')}đ. Lý do: ${reason}`,
            userIds: [userId],
            data: JSON.stringify({ amount, reason }),
        });
    }
    isUserOnline(userId) {
        return this.notificationsGateway.isUserOnline(userId);
    }
    getOnlineUsersCount() {
        return this.notificationsGateway.getOnlineUsersCount();
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_gateway_js_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map