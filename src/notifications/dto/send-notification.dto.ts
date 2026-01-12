import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum NotificationType {
  VOTE_OPENED = 'vote_opened',
  VOTE_REMINDER = 'vote_reminder',
  VOTE_CLOSED = 'vote_closed',
  MATCH_SCHEDULED = 'match_scheduled',
  MATCH_REMINDER = 'match_reminder',
  MATCH_RESULT = 'match_result',
  TEAM_ASSIGNED = 'team_assigned',
  PAYMENT_DUE = 'payment_due',
  PAYMENT_RECEIVED = 'payment_received',
  PENALTY_ISSUED = 'penalty_issued',
  GENERAL = 'general',
}

export class SendNotificationDto {
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  userIds?: string[];

  @IsString()
  @IsOptional()
  data?: string;
}

export class NotificationResponseDto {
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  sentAt: Date;
}

export class BroadcastNotificationDto {
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  data?: string;
}
