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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_js_1 = require("./schemas/payment.schema.js");
let PaymentsRepository = class PaymentsRepository {
    paymentModel;
    constructor(paymentModel) {
        this.paymentModel = paymentModel;
    }
    async create(createDto) {
        const payment = new this.paymentModel({
            user: new mongoose_2.Types.ObjectId(createDto.userId),
            amount: createDto.amount,
            type: createDto.type,
            method: createDto.method,
            reference: createDto.referenceId
                ? new mongoose_2.Types.ObjectId(createDto.referenceId)
                : undefined,
            referenceModel: createDto.referenceModel,
            description: createDto.description,
        });
        return payment.save();
    }
    async findAll() {
        return this.paymentModel
            .find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id) {
        return this.paymentModel.findById(id).populate('user', 'name email').exec();
    }
    async findByUser(userId) {
        return this.paymentModel
            .find({ user: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByStatus(status) {
        return this.paymentModel
            .find({ status })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByTransactionId(transactionId) {
        return this.paymentModel.findOne({ transactionId }).exec();
    }
    async updateStatus(id, status, transactionId) {
        const update = { status };
        if (transactionId)
            update.transactionId = transactionId;
        if (status === payment_schema_js_1.PaymentStatus.COMPLETED)
            update.paidAt = new Date();
        return this.paymentModel
            .findByIdAndUpdate(id, update, { new: true })
            .exec();
    }
    async delete(id) {
        return this.paymentModel.findByIdAndDelete(id).exec();
    }
    async getSummaryByUser(userId) {
        const result = await this.paymentModel.aggregate([
            { $match: { user: new mongoose_2.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    paidAmount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$status', payment_schema_js_1.PaymentStatus.COMPLETED] },
                                '$amount',
                                0,
                            ],
                        },
                    },
                    pendingAmount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$status', payment_schema_js_1.PaymentStatus.PENDING] },
                                '$amount',
                                0,
                            ],
                        },
                    },
                    paymentCount: { $sum: 1 },
                },
            },
        ]);
        return (result[0] || {
            totalAmount: 0,
            paidAmount: 0,
            pendingAmount: 0,
            paymentCount: 0,
        });
    }
};
exports.PaymentsRepository = PaymentsRepository;
exports.PaymentsRepository = PaymentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_js_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PaymentsRepository);
//# sourceMappingURL=payments.repository.js.map