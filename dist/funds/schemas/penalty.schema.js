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
exports.PenaltySchema = exports.Penalty = exports.PenaltyReason = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PenaltyReason;
(function (PenaltyReason) {
    PenaltyReason["LATE_ARRIVAL"] = "late_arrival";
    PenaltyReason["NO_SHOW"] = "no_show";
    PenaltyReason["LATE_CANCELLATION"] = "late_cancellation";
    PenaltyReason["OTHER"] = "other";
})(PenaltyReason || (exports.PenaltyReason = PenaltyReason = {}));
let Penalty = class Penalty {
    user;
    match;
    amount;
    reason;
    description;
    isPaid;
    paidAt;
};
exports.Penalty = Penalty;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], Penalty.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Match', required: true }),
    __metadata("design:type", Object)
], Penalty.prototype, "match", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Penalty.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PenaltyReason, required: true }),
    __metadata("design:type", String)
], Penalty.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Penalty.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Penalty.prototype, "isPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Penalty.prototype, "paidAt", void 0);
exports.Penalty = Penalty = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Penalty);
exports.PenaltySchema = mongoose_1.SchemaFactory.createForClass(Penalty);
exports.PenaltySchema.index({ user: 1, isPaid: 1 });
exports.PenaltySchema.index({ match: 1 });
//# sourceMappingURL=penalty.schema.js.map