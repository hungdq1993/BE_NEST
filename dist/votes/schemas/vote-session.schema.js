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
exports.VoteSessionSchema = exports.VoteSession = exports.VoteStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var VoteStatus;
(function (VoteStatus) {
    VoteStatus["OPEN"] = "open";
    VoteStatus["CLOSED"] = "closed";
    VoteStatus["CANCELLED"] = "cancelled";
})(VoteStatus || (exports.VoteStatus = VoteStatus = {}));
let VoteSession = class VoteSession {
    matchDate;
    deadline;
    status;
    createdBy;
    description;
    location;
};
exports.VoteSession = VoteSession;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], VoteSession.prototype, "matchDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], VoteSession.prototype, "deadline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: VoteStatus, default: VoteStatus.OPEN }),
    __metadata("design:type", String)
], VoteSession.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], VoteSession.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VoteSession.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VoteSession.prototype, "location", void 0);
exports.VoteSession = VoteSession = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VoteSession);
exports.VoteSessionSchema = mongoose_1.SchemaFactory.createForClass(VoteSession);
exports.VoteSessionSchema.index({ status: 1, matchDate: 1 });
exports.VoteSessionSchema.index({ createdBy: 1 });
//# sourceMappingURL=vote-session.schema.js.map