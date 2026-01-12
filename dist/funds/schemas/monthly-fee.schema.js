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
exports.MonthlyFeeSchema = exports.MonthlyFee = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MonthlyFee = class MonthlyFee {
    user;
    month;
    year;
    amount;
    isPaid;
    paidAt;
    note;
};
exports.MonthlyFee = MonthlyFee;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], MonthlyFee.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 12 }),
    __metadata("design:type", Number)
], MonthlyFee.prototype, "month", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MonthlyFee.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MonthlyFee.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], MonthlyFee.prototype, "isPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], MonthlyFee.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MonthlyFee.prototype, "note", void 0);
exports.MonthlyFee = MonthlyFee = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MonthlyFee);
exports.MonthlyFeeSchema = mongoose_1.SchemaFactory.createForClass(MonthlyFee);
exports.MonthlyFeeSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });
exports.MonthlyFeeSchema.index({ isPaid: 1 });
exports.MonthlyFeeSchema.index({ year: 1, month: 1 });
//# sourceMappingURL=monthly-fee.schema.js.map