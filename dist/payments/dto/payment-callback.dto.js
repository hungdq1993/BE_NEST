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
exports.CassoWebhookDto = exports.MomoCallbackDto = exports.VnpayCallbackDto = void 0;
const class_validator_1 = require("class-validator");
class VnpayCallbackDto {
    vnp_TxnRef;
    vnp_ResponseCode;
    vnp_TransactionNo;
    vnp_SecureHash;
    vnp_Amount;
    vnp_BankCode;
    vnp_PayDate;
}
exports.VnpayCallbackDto = VnpayCallbackDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VnpayCallbackDto.prototype, "vnp_TxnRef", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VnpayCallbackDto.prototype, "vnp_ResponseCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VnpayCallbackDto.prototype, "vnp_TransactionNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VnpayCallbackDto.prototype, "vnp_SecureHash", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VnpayCallbackDto.prototype, "vnp_Amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VnpayCallbackDto.prototype, "vnp_BankCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VnpayCallbackDto.prototype, "vnp_PayDate", void 0);
class MomoCallbackDto {
    orderId;
    resultCode;
    transId;
    signature;
    amount;
    message;
}
exports.MomoCallbackDto = MomoCallbackDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MomoCallbackDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MomoCallbackDto.prototype, "resultCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MomoCallbackDto.prototype, "transId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MomoCallbackDto.prototype, "signature", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MomoCallbackDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MomoCallbackDto.prototype, "message", void 0);
var casso_webhook_dto_js_1 = require("./casso-webhook.dto.js");
Object.defineProperty(exports, "CassoWebhookDto", { enumerable: true, get: function () { return casso_webhook_dto_js_1.CassoWebhookDto; } });
//# sourceMappingURL=payment-callback.dto.js.map