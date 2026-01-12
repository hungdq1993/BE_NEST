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
exports.FundsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const monthly_fee_schema_js_1 = require("./schemas/monthly-fee.schema.js");
const penalty_schema_js_1 = require("./schemas/penalty.schema.js");
const match_payment_schema_js_1 = require("./schemas/match-payment.schema.js");
const expense_schema_js_1 = require("./schemas/expense.schema.js");
let FundsRepository = class FundsRepository {
    monthlyFeeModel;
    penaltyModel;
    matchPaymentModel;
    expenseModel;
    constructor(monthlyFeeModel, penaltyModel, matchPaymentModel, expenseModel) {
        this.monthlyFeeModel = monthlyFeeModel;
        this.penaltyModel = penaltyModel;
        this.matchPaymentModel = matchPaymentModel;
        this.expenseModel = expenseModel;
    }
    async createMatchPayment(dto) {
        const payment = new this.matchPaymentModel({
            user: new mongoose_2.Types.ObjectId(dto.userId),
            match: new mongoose_2.Types.ObjectId(dto.matchId),
            amount: dto.amount,
            isPaid: dto.isPaid || false,
            note: dto.note,
        });
        return payment.save();
    }
    async bulkCreateMatchPayments(dto) {
        const payments = dto.players.map((player) => ({
            user: new mongoose_2.Types.ObjectId(player.userId),
            match: new mongoose_2.Types.ObjectId(dto.matchId),
            amount: player.amount,
            isPaid: player.isPaid || false,
        }));
        return this.matchPaymentModel.insertMany(payments);
    }
    async findMatchPaymentsByMatch(matchId) {
        return this.matchPaymentModel
            .find({ match: new mongoose_2.Types.ObjectId(matchId) })
            .populate('user', 'name email')
            .exec();
    }
    async findMatchPaymentsByUser(userId) {
        return this.matchPaymentModel
            .find({ user: new mongoose_2.Types.ObjectId(userId) })
            .populate('match', 'matchDate location')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findAllMatchPayments() {
        return this.matchPaymentModel
            .find()
            .populate('user', 'name email')
            .populate('match', 'matchDate location')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findUnpaidMatchPayments() {
        return this.matchPaymentModel
            .find({ isPaid: false })
            .populate('user', 'name email')
            .populate('match', 'matchDate location')
            .exec();
    }
    async markMatchPaymentPaid(id) {
        return this.matchPaymentModel
            .findByIdAndUpdate(id, { isPaid: true, paidAt: new Date() }, { new: true })
            .exec();
    }
    async deleteMatchPayment(id) {
        return this.matchPaymentModel.findByIdAndDelete(id).exec();
    }
    async getMatchPaymentStats() {
        const result = await this.matchPaymentModel.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    paid: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] } },
                    unpaid: {
                        $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] },
                    },
                },
            },
        ]);
        if (Array.isArray(result) &&
            typeof result[0] === 'object' &&
            result[0] !== null) {
            const stats = result[0];
            const total = typeof stats.total === 'number' ? stats.total : 0;
            const paid = typeof stats.paid === 'number' ? stats.paid : 0;
            const unpaid = typeof stats.unpaid === 'number' ? stats.unpaid : 0;
            return { total, paid, unpaid };
        }
        return { total: 0, paid: 0, unpaid: 0 };
    }
    async createExpense(dto) {
        const expense = new this.expenseModel({
            description: dto.description,
            amount: dto.amount,
            category: dto.category || expense_schema_js_1.ExpenseCategory.FIELD_RENTAL,
            match: dto.matchId ? new mongoose_2.Types.ObjectId(dto.matchId) : undefined,
            date: new Date(dto.date),
            note: dto.note,
        });
        return expense.save();
    }
    async findAllExpenses(startDate, endDate, category) {
        const filter = {};
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }
        if (category) {
            filter.category = category;
        }
        return this.expenseModel
            .find(filter)
            .populate('match', 'matchDate location')
            .sort({ date: -1 })
            .exec();
    }
    async findExpensesByDateRange(startDate, endDate) {
        return this.expenseModel
            .find({ date: { $gte: startDate, $lte: endDate } })
            .populate('match', 'matchDate location')
            .sort({ date: -1 })
            .exec();
    }
    async findExpensesByMatch(matchId) {
        return this.expenseModel
            .find({ match: new mongoose_2.Types.ObjectId(matchId) })
            .exec();
    }
    async updateExpense(id, dto) {
        const updateData = { ...dto };
        if (dto.matchId) {
            updateData.match = new mongoose_2.Types.ObjectId(dto.matchId);
            delete updateData.matchId;
        }
        if (dto.date) {
            updateData.date = new Date(dto.date);
        }
        return this.expenseModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
    }
    async deleteExpense(id) {
        return this.expenseModel.findByIdAndDelete(id).exec();
    }
    async getExpenseStats() {
        const result = await this.expenseModel.aggregate([
            {
                $group: {
                    _id: '$category',
                    amount: { $sum: '$amount' },
                },
            },
        ]);
        const total = result.reduce((sum, item) => sum + item.amount, 0);
        return {
            total,
            byCategory: result.map((item) => ({
                category: item._id,
                amount: item.amount,
            })),
        };
    }
    async createMonthlyFee(dto) {
        const fee = new this.monthlyFeeModel({
            user: new mongoose_2.Types.ObjectId(dto.userId),
            month: dto.month,
            year: dto.year,
            amount: dto.amount,
            note: dto.note,
        });
        return fee.save();
    }
    async bulkCreateMonthlyFees(dto, userIds) {
        if (userIds.length === 0) {
            return [];
        }
        const feesToCreate = userIds.map((userId) => ({
            user: new mongoose_2.Types.ObjectId(userId),
            month: dto.month,
            year: dto.year,
            amount: dto.amount,
            note: dto.note,
        }));
        try {
            const result = await this.monthlyFeeModel.insertMany(feesToCreate, {
                ordered: false,
            });
            const ids = result.map((fee) => fee._id);
            return this.monthlyFeeModel
                .find({ _id: { $in: ids } })
                .populate('user', 'name email')
                .exec();
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'insertedIds' in error &&
                error.insertedIds &&
                typeof error.insertedIds === 'object') {
                const insertedIds = Object.values(error.insertedIds);
                if (insertedIds.length > 0) {
                    return this.monthlyFeeModel
                        .find({
                        _id: { $in: insertedIds },
                    })
                        .populate('user', 'name email')
                        .exec();
                }
            }
            return this.findMonthlyFeesByPeriod(dto.month, dto.year);
        }
    }
    async findAllMonthlyFees() {
        return this.monthlyFeeModel
            .find()
            .populate('user', 'name email')
            .sort({ year: -1, month: -1 })
            .exec();
    }
    async findMonthlyFeesByUser(userId) {
        return this.monthlyFeeModel
            .find({ user: new mongoose_2.Types.ObjectId(userId) })
            .sort({ year: -1, month: -1 })
            .exec();
    }
    async findMonthlyFeesByPeriod(month, year) {
        return this.monthlyFeeModel
            .find({ month, year })
            .populate('user', 'name email')
            .exec();
    }
    async findUnpaidMonthlyFees() {
        return this.monthlyFeeModel
            .find({ isPaid: false })
            .populate('user', 'name email')
            .sort({ year: -1, month: -1 })
            .exec();
    }
    async findUnpaidMonthlyFeesByYear(year) {
        return this.monthlyFeeModel
            .find({ isPaid: false, year })
            .populate('user', 'name email')
            .sort({ month: -1 })
            .exec();
    }
    async markMonthlyFeePaid(id) {
        return this.monthlyFeeModel
            .findByIdAndUpdate(id, { isPaid: true, paidAt: new Date() }, { new: true })
            .populate('user', 'name email')
            .exec();
    }
    async createAndPayMonthlyFee(dto) {
        const fee = new this.monthlyFeeModel({
            user: new mongoose_2.Types.ObjectId(dto.userId),
            month: dto.month,
            year: dto.year,
            amount: dto.amount,
            note: dto.note,
            isPaid: true,
            paidAt: new Date(),
        });
        const savedFee = await fee.save();
        return this.monthlyFeeModel
            .findById(savedFee._id)
            .populate('user', 'name email')
            .exec();
    }
    async deleteMonthlyFee(id) {
        return this.monthlyFeeModel.findByIdAndDelete(id).exec();
    }
    async createPenalty(dto) {
        const penalty = new this.penaltyModel({
            user: new mongoose_2.Types.ObjectId(dto.userId),
            match: new mongoose_2.Types.ObjectId(dto.matchId),
            amount: dto.amount,
            reason: dto.reason,
            description: dto.description,
        });
        return penalty.save();
    }
    async findAllPenalties() {
        return this.penaltyModel
            .find()
            .populate('user', 'name email')
            .populate('match', 'matchDate location')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findPenaltiesByUser(userId) {
        return this.penaltyModel
            .find({ user: new mongoose_2.Types.ObjectId(userId) })
            .populate('match', 'matchDate location')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findPenaltiesByMatch(matchId) {
        return this.penaltyModel
            .find({ match: new mongoose_2.Types.ObjectId(matchId) })
            .populate('user', 'name email')
            .exec();
    }
    async findUnpaidPenalties() {
        return this.penaltyModel
            .find({ isPaid: false })
            .populate('user', 'name email')
            .populate('match', 'matchDate location')
            .sort({ createdAt: -1 })
            .exec();
    }
    async markPenaltyPaid(id) {
        return this.penaltyModel
            .findByIdAndUpdate(id, { isPaid: true, paidAt: new Date() }, { new: true })
            .exec();
    }
    async deletePenalty(id) {
        return this.penaltyModel.findByIdAndDelete(id).exec();
    }
    async getMonthlyFeeStats() {
        return this.monthlyFeeModel.aggregate([
            {
                $group: {
                    _id: { month: '$month', year: '$year' },
                    collected: {
                        $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] },
                    },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] },
                    },
                    paidCount: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] } },
                    unpaidCount: { $sum: { $cond: [{ $eq: ['$isPaid', false] }, 1, 0] } },
                },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
        ]);
    }
    async getPenaltyStats() {
        const result = await this.penaltyModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalPenalties: { $sum: '$amount' },
                    collectedPenalties: {
                        $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] },
                    },
                    pendingPenalties: {
                        $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] },
                    },
                },
            },
        ]);
        return (result[0] ?? {
            totalPenalties: 0,
            collectedPenalties: 0,
            pendingPenalties: 0,
        });
    }
    async getUserFundSummary(userId) {
        const [monthlyFeeResult, penaltyResult, matchPaymentResult] = await Promise.all([
            this.monthlyFeeModel.aggregate([
                { $match: { user: new mongoose_2.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                        paid: {
                            $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] },
                        },
                        pending: {
                            $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] },
                        },
                    },
                },
            ]),
            this.penaltyModel.aggregate([
                { $match: { user: new mongoose_2.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                        paid: {
                            $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] },
                        },
                        pending: {
                            $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] },
                        },
                    },
                },
            ]),
            this.matchPaymentModel.aggregate([
                { $match: { user: new mongoose_2.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                        paid: {
                            $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] },
                        },
                        pending: {
                            $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] },
                        },
                    },
                },
            ]),
        ]);
        return {
            monthlyFees: monthlyFeeResult[0] ?? { total: 0, paid: 0, pending: 0 },
            penalties: penaltyResult[0] ?? { total: 0, paid: 0, pending: 0 },
            matchPayments: matchPaymentResult[0] ?? { total: 0, paid: 0, pending: 0 },
        };
    }
    async getUserDebtDetail(userId) {
        const [unpaidMonthlyFees, unpaidMatchPayments, unpaidPenalties] = await Promise.all([
            this.monthlyFeeModel
                .find({ user: new mongoose_2.Types.ObjectId(userId), isPaid: false })
                .sort({ year: -1, month: -1 })
                .exec(),
            this.matchPaymentModel
                .find({ user: new mongoose_2.Types.ObjectId(userId), isPaid: false })
                .populate('match', 'matchDate location')
                .sort({ createdAt: -1 })
                .exec(),
            this.penaltyModel
                .find({ user: new mongoose_2.Types.ObjectId(userId), isPaid: false })
                .populate('match', 'matchDate location')
                .sort({ createdAt: -1 })
                .exec(),
        ]);
        return { unpaidMonthlyFees, unpaidMatchPayments, unpaidPenalties };
    }
    async getFundSummary() {
        const [matchPaymentStats, monthlyFeeStats, penaltyStats, expenseStats] = await Promise.all([
            this.getMatchPaymentStats(),
            this.monthlyFeeModel.aggregate([
                { $match: { isPaid: true } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.penaltyModel.aggregate([
                { $match: { isPaid: true } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.getExpenseStats(),
        ]);
        const matchPaymentsIncome = matchPaymentStats.paid;
        const monthlyFeesIncome = monthlyFeeStats[0]?.total ?? 0;
        const penaltiesIncome = penaltyStats[0]?.total ?? 0;
        const totalIncome = matchPaymentsIncome + monthlyFeesIncome + penaltiesIncome;
        const totalExpense = expenseStats.total;
        const expenseBreakdown = {
            fieldRental: 0,
            drinks: 0,
            equipment: 0,
            other: 0,
        };
        expenseStats.byCategory.forEach((item) => {
            const category = item.category;
            switch (category) {
                case expense_schema_js_1.ExpenseCategory.FIELD_RENTAL:
                    expenseBreakdown.fieldRental = item.amount;
                    break;
                case expense_schema_js_1.ExpenseCategory.DRINKS:
                    expenseBreakdown.drinks = item.amount;
                    break;
                case expense_schema_js_1.ExpenseCategory.EQUIPMENT:
                    expenseBreakdown.equipment = item.amount;
                    break;
                default:
                    expenseBreakdown.other += item.amount;
            }
        });
        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            incomeBreakdown: {
                matchPayments: matchPaymentsIncome,
                monthlyFees: monthlyFeesIncome,
                penalties: penaltiesIncome,
            },
            expenseBreakdown,
        };
    }
};
exports.FundsRepository = FundsRepository;
exports.FundsRepository = FundsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(monthly_fee_schema_js_1.MonthlyFee.name)),
    __param(1, (0, mongoose_1.InjectModel)(penalty_schema_js_1.Penalty.name)),
    __param(2, (0, mongoose_1.InjectModel)(match_payment_schema_js_1.MatchPayment.name)),
    __param(3, (0, mongoose_1.InjectModel)(expense_schema_js_1.Expense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], FundsRepository);
//# sourceMappingURL=funds.repository.js.map