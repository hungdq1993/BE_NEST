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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastNotificationDto = exports.NotificationResponseDto = exports.SendNotificationDto = exports.NotificationType = void 0;
const class_validator_1 = require("class-validator");
var NotificationType;
(function (NotificationType) {
    NotificationType["VOTE_OPENED"] = "vote_opened";
    NotificationType["VOTE_REMINDER"] = "vote_reminder";
    NotificationType["VOTE_CLOSED"] = "vote_closed";
    NotificationType["MATCH_SCHEDULED"] = "match_scheduled";
    NotificationType["MATCH_REMINDER"] = "match_reminder";
    NotificationType["MATCH_RESULT"] = "match_result";
    NotificationType["TEAM_ASSIGNED"] = "team_assigned";
    NotificationType["PAYMENT_DUE"] = "payment_due";
    NotificationType["PAYMENT_RECEIVED"] = "payment_received";
    NotificationType["PENALTY_ISSUED"] = "penalty_issued";
    NotificationType["GENERAL"] = "general";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
class SendNotificationDto {
    type;
    title;
    message;
    userIds;
    data;
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, class_validator_1.IsEnum)(NotificationType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendNotificationDto.prototype, "userIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "data", void 0);
class NotificationResponseDto {
    type;
    title;
    message;
    data;
    sentAt;
}
exports.NotificationResponseDto = NotificationResponseDto;
class BroadcastNotificationDto {
    type;
    title;
    message;
    data;
}
exports.BroadcastNotificationDto = BroadcastNotificationDto;
__decorate([
    (0, class_validator_1.IsEnum)(NotificationType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BroadcastNotificationDto.prototype, "data", void 0);
//# sourceMappingURL=send-notification.dto.js.map