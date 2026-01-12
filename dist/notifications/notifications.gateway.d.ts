import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationResponseDto } from './dto/send-notification.dto.js';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private userSockets;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, data: {
        userId: string;
    }): {
        success: boolean;
        message: string;
    };
    handleLeave(client: Socket, data: {
        userId: string;
    }): {
        success: boolean;
        message: string;
    };
    sendToUsers(userIds: string[], notification: NotificationResponseDto): void;
    broadcast(notification: NotificationResponseDto): void;
    isUserOnline(userId: string): boolean;
    getOnlineUsersCount(): number;
    getOnlineUserIds(): string[];
}
