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
exports.VoteResponseSchema = exports.VoteResponse = exports.VoteChoice = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var VoteChoice;
(function (VoteChoice) {
    VoteChoice["YES"] = "yes";
    VoteChoice["NO"] = "no";
    VoteChoice["MAYBE"] = "maybe";
})(VoteChoice || (exports.VoteChoice = VoteChoice = {}));
let VoteResponse = class VoteResponse {
    session;
    user;
    choice;
    note;
};
exports.VoteResponse = VoteResponse;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'VoteSession', required: true }),
    __metadata("design:type", Object)
], VoteResponse.prototype, "session", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], VoteResponse.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: VoteChoice, required: true }),
    __metadata("design:type", String)
], VoteResponse.prototype, "choice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VoteResponse.prototype, "note", void 0);
exports.VoteResponse = VoteResponse = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VoteResponse);
exports.VoteResponseSchema = mongoose_1.SchemaFactory.createForClass(VoteResponse);
exports.VoteResponseSchema.index({ session: 1, user: 1 }, { unique: true });
exports.VoteResponseSchema.index({ session: 1, choice: 1 });
//# sourceMappingURL=vote-response.schema.js.map