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
exports.FundsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const funds_repository_js_1 = require("./funds.repository.js");
const matches_service_js_1 = require("../matches/matches.service.js");
const users_service_js_1 = require("../users/users.service.js");
function isPopulatedUser(user) {
    return (typeof user === 'object' && user !== null && '_id' in user && 'name' in user);
}
function isPopulatedMatch(match) {
    return (typeof match === 'object' &&
        match !== null &&
        '_id' in match &&
        'matchDate' in match);
}
function extractUserId(user) {
    if (!user) {
        return '';
    }
    if (isPopulatedUser(user)) {
        return user._id.toString();
    }
    if (user instanceof mongoose_1.Types.ObjectId) {
        return user.toString();
    }
    return user._id.toString();
}
function extractUserName(user) {
    if (!user) {
        return undefined;
    }
    if (isPopulatedUser(user)) {
        return user.name;
    }
    if (user instanceof mongoose_1.Types.ObjectId) {
        return undefined;
    }
    return user.name;
}
function extractMatchId(match) {
    if (!match) {
        return '';
    }
    if (isPopulatedMatch(match)) {
        return match._id.toString();
    }
    if (match instanceof mongoose_1.Types.ObjectId) {
        return match.toString();
    }
    return match._id.toString();
}
function extractMatchDate(match) {
    if (!match) {
        return undefined;
    }
    if (isPopulatedMatch(match)) {
        return match.matchDate;
    }
    if (match instanceof mongoose_1.Types.ObjectId) {
        return undefined;
    }
    return match.matchDate;
}
let FundsService = class FundsService {
    fundsRepository;
    matchesService;
    usersService;
    constructor(fundsRepository, matchesService, usersService) {
        this.fundsRepository = fundsRepository;
        this.matchesService = matchesService;
        this.usersService = usersService;
    }
    async createMatchPayment(dto) {
        const payment = await this.fundsRepository.createMatchPayment(dto);
        return this.toMatchPaymentResponseDto(payment);
    }
    async bulkCreateMatchPayments(dto) {
        const payments = await this.fundsRepository.bulkCreateMatchPayments(dto);
        return payments.map((p) => this.toMatchPaymentResponseDto(p));
    }
    async findMatchPaymentsByMatch(matchId) {
        const payments = await this.fundsRepository.findMatchPaymentsByMatch(matchId);
        return payments.map((p) => this.toMatchPaymentResponseDto(p));
    }
    async findAllMatchPayments() {
        const payments = await this.fundsRepository.findAllMatchPayments();
        const validPayments = payments.filter((p) => p.user && p.match);
        return validPayments.map((p) => this.toMatchPaymentResponseDto(p));
    }
    async findUnpaidMatchPayments() {
        const payments = await this.fundsRepository.findUnpaidMatchPayments();
        return payments.map((p) => this.toMatchPaymentResponseDto(p));
    }
    async markMatchPaymentPaid(id) {
        const payment = await this.fundsRepository.markMatchPaymentPaid(id);
        if (!payment)
            throw new common_1.NotFoundException('Match payment not found');
        return this.toMatchPaymentResponseDto(payment);
    }
    async deleteMatchPayment(id) {
        const payment = await this.fundsRepository.deleteMatchPayment(id);
        if (!payment)
            throw new common_1.NotFoundException('Match payment not found');
    }
    async createExpense(dto) {
        const expense = await this.fundsRepository.createExpense(dto);
        return this.toExpenseResponseDto(expense);
    }
    async findAllExpenses(startDate, endDate, category) {
        const expenses = await this.fundsRepository.findAllExpenses(startDate, endDate, category);
        return expenses.map((e) => this.toExpenseResponseDto(e));
    }
    async updateExpense(id, dto) {
        const expense = await this.fundsRepository.updateExpense(id, dto);
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        return this.toExpenseResponseDto(expense);
    }
    async deleteExpense(id) {
        const expense = await this.fundsRepository.deleteExpense(id);
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
    }
    async getFundSummary() {
        return this.fundsRepository.getFundSummary();
    }
    async createMonthlyFee(dto) {
        try {
            const fee = await this.fundsRepository.createMonthlyFee(dto);
            return this.toMonthlyFeeResponseDto(fee);
        }
        catch (error) {
            if (error &&
                typeof error === 'object' &&
                'code' in error &&
                error.code === 11000) {
                throw new common_1.BadRequestException(`Tiền tháng cho user này trong tháng ${dto.month}/${dto.year} đã tồn tại`);
            }
            throw error;
        }
    }
    async bulkCreateMonthlyFees(dto) {
        const users = await this.usersService.findAll();
        if (users.length === 0) {
            throw new common_1.BadRequestException('Không có user nào trong hệ thống');
        }
        const fees = await this.fundsRepository.bulkCreateMonthlyFees(dto, users.map((u) => u.id));
        return fees.map((f) => this.toMonthlyFeeResponseDto(f));
    }
    async findAllMonthlyFees() {
        const fees = await this.fundsRepository.findAllMonthlyFees();
        return fees.map((f) => this.toMonthlyFeeResponseDto(f));
    }
    async findMonthlyFeesByUser(userId) {
        const fees = await this.fundsRepository.findMonthlyFeesByUser(userId);
        return fees.map((f) => this.toMonthlyFeeResponseDto(f));
    }
    async findMonthlyFeesByPeriod(month, year) {
        const fees = await this.fundsRepository.findMonthlyFeesByPeriod(month, year);
        return fees.map((f) => this.toMonthlyFeeResponseDto(f));
    }
    async getMonthlyFeePeriodStatus(month, year) {
        const fees = await this.fundsRepository.findMonthlyFeesByPeriod(month, year);
        if (fees.length === 0) {
            return {
                month,
                year,
                totalUsers: 0,
                paidUsers: [],
                unpaidUsers: [],
                totalAmount: 0,
                paidAmount: 0,
                unpaidAmount: 0,
                totalUnpaidAllMonths: 0,
            };
        }
        const unpaidFeesInYear = await this.fundsRepository.findUnpaidMonthlyFeesByYear(year);
        const totalUnpaidAllMonths = unpaidFeesInYear.reduce((sum, fee) => sum + fee.amount, 0);
        const paidUsers = [];
        const unpaidUsers = [];
        let totalAmount = 0;
        let paidAmount = 0;
        let unpaidAmount = 0;
        for (const fee of fees) {
            const userId = extractUserId(fee.user);
            const userName = extractUserName(fee.user) || 'Unknown';
            totalAmount += fee.amount;
            if (fee.isPaid) {
                paidUsers.push({
                    userId,
                    userName,
                    feeId: fee._id.toString(),
                    amount: fee.amount,
                    paidAt: fee.paidAt || fee.updatedAt,
                });
                paidAmount += fee.amount;
            }
            else {
                unpaidUsers.push({
                    userId,
                    userName,
                    feeId: fee._id.toString(),
                    amount: fee.amount,
                });
                unpaidAmount += fee.amount;
            }
        }
        return {
            month,
            year,
            totalUsers: fees.length,
            paidUsers,
            unpaidUsers,
            totalAmount,
            paidAmount,
            unpaidAmount,
            totalUnpaidAllMonths,
        };
    }
    async findUnpaidMonthlyFees() {
        const fees = await this.fundsRepository.findUnpaidMonthlyFees();
        return fees.map((f) => this.toMonthlyFeeResponseDto(f));
    }
    async markMonthlyFeePaid(id) {
        const fee = await this.fundsRepository.markMonthlyFeePaid(id);
        if (!fee)
            throw new common_1.NotFoundException('Monthly fee not found');
        return this.toMonthlyFeeResponseDto(fee);
    }
    async createAndPayMonthlyFee(dto) {
        const existingFees = await this.fundsRepository.findMonthlyFeesByPeriod(dto.month, dto.year);
        const existingFee = existingFees.find(f => extractUserId(f.user) === dto.userId);
        if (existingFee) {
            if (existingFee.isPaid) {
                throw new common_1.BadRequestException('User đã đóng tiền tháng này rồi');
            }
            const paidFee = await this.fundsRepository.markMonthlyFeePaid(existingFee._id.toString());
            if (!paidFee)
                throw new common_1.NotFoundException('Monthly fee not found');
            return this.toMonthlyFeeResponseDto(paidFee);
        }
        const fee = await this.fundsRepository.createAndPayMonthlyFee(dto);
        return this.toMonthlyFeeResponseDto(fee);
    }
    async deleteMonthlyFee(id) {
        const fee = await this.fundsRepository.deleteMonthlyFee(id);
        if (!fee)
            throw new common_1.NotFoundException('Monthly fee not found');
    }
    async createPenalty(dto) {
        const penalty = await this.fundsRepository.createPenalty(dto);
        return this.toPenaltyResponseDto(penalty);
    }
    async findAllPenalties() {
        const penalties = await this.fundsRepository.findAllPenalties();
        return penalties.map((p) => this.toPenaltyResponseDto(p));
    }
    async findPenaltiesByUser(userId) {
        const penalties = await this.fundsRepository.findPenaltiesByUser(userId);
        return penalties.map((p) => this.toPenaltyResponseDto(p));
    }
    async findPenaltiesByMatch(matchId) {
        const penalties = await this.fundsRepository.findPenaltiesByMatch(matchId);
        return penalties.map((p) => this.toPenaltyResponseDto(p));
    }
    async findUnpaidPenalties() {
        const penalties = await this.fundsRepository.findUnpaidPenalties();
        return penalties.map((p) => this.toPenaltyResponseDto(p));
    }
    async markPenaltyPaid(id) {
        const penalty = await this.fundsRepository.markPenaltyPaid(id);
        if (!penalty)
            throw new common_1.NotFoundException('Penalty not found');
        return this.toPenaltyResponseDto(penalty);
    }
    async deletePenalty(id) {
        const penalty = await this.fundsRepository.deletePenalty(id);
        if (!penalty)
            throw new common_1.NotFoundException('Penalty not found');
    }
    async getFundStats() {
        const [monthlyFeeStats, penaltyStats] = await Promise.all([
            this.fundsRepository.getMonthlyFeeStats(),
            this.fundsRepository.getPenaltyStats(),
        ]);
        const totalCollected = monthlyFeeStats.reduce((sum, s) => sum + s.collected, 0) +
            penaltyStats.collectedPenalties;
        const totalPending = monthlyFeeStats.reduce((sum, s) => sum + s.pending, 0) +
            penaltyStats.pendingPenalties;
        return {
            totalCollected,
            totalPending,
            monthlyFeeStats: monthlyFeeStats.map((s) => ({
                month: s._id.month,
                year: s._id.year,
                collected: s.collected,
                pending: s.pending,
                paidCount: s.paidCount,
                unpaidCount: s.unpaidCount,
            })),
            penaltyStats,
        };
    }
    async getAllUsersStatistics() {
        const allUsers = await this.usersService.findAll();
        const userStatsPromises = allUsers.map(async (user) => {
            const summary = await this.fundsRepository.getUserFundSummary(user.id);
            const matchPayments = await this.fundsRepository.findMatchPaymentsByUser(user.id);
            const losingMatchesCount = matchPayments.filter((p) => !p.isPaid).length;
            const totalOwed = summary.monthlyFees.pending +
                summary.penalties.pending +
                summary.matchPayments.pending;
            const totalPaid = summary.monthlyFees.paid +
                summary.penalties.paid +
                summary.matchPayments.paid;
            return {
                userId: user.id,
                userName: user.name,
                email: user.email,
                role: user.role,
                skillLevel: user.skillLevel,
                isActive: user.isActive,
                totalOwed,
                totalPaid,
                pendingMonthlyFees: summary.monthlyFees.pending,
                pendingPenalties: summary.penalties.pending,
                pendingMatchPayments: summary.matchPayments.pending,
                losingMatchesCount,
                totalMonthlyFees: summary.monthlyFees.total,
                paidMonthlyFees: summary.monthlyFees.paid,
                unpaidMonthlyFees: summary.monthlyFees.pending,
                totalPenalties: summary.penalties.total,
                paidPenalties: summary.penalties.paid,
                unpaidPenalties: summary.penalties.pending,
                totalMatchPayments: summary.matchPayments.total,
                paidMatchPayments: summary.matchPayments.paid,
                unpaidMatchPayments: summary.matchPayments.pending,
            };
        });
        const users = await Promise.all(userStatsPromises);
        const summary = {
            totalOwed: users.reduce((sum, u) => sum + u.totalOwed, 0),
            totalPaid: users.reduce((sum, u) => sum + u.totalPaid, 0),
            totalPendingMonthlyFees: users.reduce((sum, u) => sum + u.pendingMonthlyFees, 0),
            totalPendingPenalties: users.reduce((sum, u) => sum + u.pendingPenalties, 0),
            totalPendingMatchPayments: users.reduce((sum, u) => sum + u.pendingMatchPayments, 0),
        };
        return {
            totalUsers: users.length,
            users,
            summary,
        };
    }
    async getUserFundSummary(userId, userName) {
        const summary = await this.fundsRepository.getUserFundSummary(userId);
        const totalOwed = summary.monthlyFees.pending +
            summary.penalties.pending +
            summary.matchPayments.pending;
        const totalPaid = summary.monthlyFees.paid +
            summary.penalties.paid +
            summary.matchPayments.paid;
        return {
            userId,
            userName,
            totalMonthlyFees: summary.monthlyFees.total,
            paidMonthlyFees: summary.monthlyFees.paid,
            pendingMonthlyFees: summary.monthlyFees.pending,
            totalPenalties: summary.penalties.total,
            paidPenalties: summary.penalties.paid,
            pendingPenalties: summary.penalties.pending,
            totalMatchPayments: summary.matchPayments.total,
            paidMatchPayments: summary.matchPayments.paid,
            pendingMatchPayments: summary.matchPayments.pending,
            totalOwed,
            totalPaid,
        };
    }
    async getAllDebts() {
        const [unpaidMonthlyFees, unpaidPenalties, unpaidMatchPayments] = await Promise.all([
            this.fundsRepository.findUnpaidMonthlyFees(),
            this.fundsRepository.findUnpaidPenalties(),
            this.fundsRepository.findUnpaidMatchPayments(),
        ]);
        const monthlyFeeDebts = unpaidMonthlyFees.map((fee) => ({
            id: fee._id.toString(),
            type: 'MONTHLY_FEE',
            userId: extractUserId(fee.user),
            userName: extractUserName(fee.user) || 'Unknown',
            amount: fee.amount,
            createdAt: fee.createdAt,
            month: fee.month,
            year: fee.year,
            note: fee.note,
        }));
        const penaltyDebts = unpaidPenalties.map((penalty) => ({
            id: penalty._id.toString(),
            type: 'PENALTY',
            userId: extractUserId(penalty.user),
            userName: extractUserName(penalty.user) || 'Unknown',
            amount: penalty.amount,
            createdAt: penalty.createdAt,
            matchId: extractMatchId(penalty.match),
            matchDate: extractMatchDate(penalty.match),
            reason: penalty.reason,
            description: penalty.description,
        }));
        const matchPaymentDebts = unpaidMatchPayments.map((payment) => ({
            id: payment._id.toString(),
            type: 'MATCH_PAYMENT',
            userId: extractUserId(payment.user),
            userName: extractUserName(payment.user) || 'Unknown',
            amount: payment.amount,
            createdAt: payment.createdAt,
            matchId: extractMatchId(payment.match),
            matchDate: extractMatchDate(payment.match),
            matchLocation: isPopulatedMatch(payment.match)
                ? payment.match.location
                : undefined,
            note: payment.note,
        }));
        const allDebts = [
            ...monthlyFeeDebts,
            ...penaltyDebts,
            ...matchPaymentDebts,
        ];
        const monthlyFeesAmount = monthlyFeeDebts.reduce((sum, d) => sum + d.amount, 0);
        const penaltiesAmount = penaltyDebts.reduce((sum, d) => sum + d.amount, 0);
        const matchPaymentsAmount = matchPaymentDebts.reduce((sum, d) => sum + d.amount, 0);
        return {
            totalDebts: allDebts.length,
            totalAmount: monthlyFeesAmount + penaltiesAmount + matchPaymentsAmount,
            debts: allDebts,
            summary: {
                monthlyFeesCount: monthlyFeeDebts.length,
                monthlyFeesAmount,
                penaltiesCount: penaltyDebts.length,
                penaltiesAmount,
                matchPaymentsCount: matchPaymentDebts.length,
                matchPaymentsAmount,
            },
        };
    }
    async getUserDebtDetail(userId, userName) {
        const debtDetail = await this.fundsRepository.getUserDebtDetail(userId);
        const unpaidMonthlyFees = debtDetail.unpaidMonthlyFees.map((fee) => ({
            id: fee._id.toString(),
            month: fee.month,
            year: fee.year,
            amount: fee.amount,
            note: fee.note,
            createdAt: fee.createdAt,
        }));
        const unpaidMatchPayments = debtDetail.unpaidMatchPayments.map((payment) => ({
            id: payment._id.toString(),
            matchId: extractMatchId(payment.match),
            matchDate: extractMatchDate(payment.match),
            matchLocation: isPopulatedMatch(payment.match)
                ? payment.match.location
                : undefined,
            amount: payment.amount,
            note: payment.note,
            createdAt: payment.createdAt,
        }));
        const unpaidPenalties = debtDetail.unpaidPenalties.map((penalty) => ({
            id: penalty._id.toString(),
            matchId: extractMatchId(penalty.match),
            matchDate: extractMatchDate(penalty.match),
            reason: penalty.reason,
            description: penalty.description,
            amount: penalty.amount,
            createdAt: penalty.createdAt,
        }));
        const totalOwed = unpaidMonthlyFees.reduce((sum, f) => sum + f.amount, 0) +
            unpaidMatchPayments.reduce((sum, p) => sum + p.amount, 0) +
            unpaidPenalties.reduce((sum, p) => sum + p.amount, 0);
        const summary = await this.fundsRepository.getUserFundSummary(userId);
        const totalPaid = summary.monthlyFees.paid +
            summary.penalties.paid +
            summary.matchPayments.paid;
        return {
            userId,
            userName,
            totalOwed,
            totalPaid,
            unpaidMonthlyFees,
            unpaidMatchPayments,
            unpaidPenalties,
        };
    }
    async getMatchDetailWithPayments(matchId) {
        const matchWithLineups = await this.matchesService.findMatchById(matchId);
        if (!matchWithLineups) {
            throw new common_1.NotFoundException('Match not found');
        }
        const payments = await this.fundsRepository.findMatchPaymentsByMatch(matchId);
        let winningTeam;
        if (matchWithLineups.result) {
            const { teamAScore, teamBScore } = matchWithLineups.result;
            if (teamAScore > teamBScore) {
                winningTeam = 'A';
            }
            else if (teamBScore > teamAScore) {
                winningTeam = 'B';
            }
            else {
                winningTeam = 'DRAW';
            }
        }
        const paymentMap = new Map();
        payments.forEach((payment) => {
            const userId = extractUserId(payment.user);
            paymentMap.set(userId, payment);
        });
        const mapPlayersWithPayment = (players) => {
            return players.map((player) => {
                const payment = paymentMap.get(player.id);
                return {
                    id: player.id,
                    name: player.name,
                    skillLevel: player.skillLevel,
                    payment: payment
                        ? {
                            id: payment._id.toString(),
                            amount: payment.amount,
                            isPaid: payment.isPaid,
                            paidAt: payment.paidAt,
                        }
                        : undefined,
                };
            });
        };
        const losingTeamPlayers = [];
        if (winningTeam && winningTeam !== 'DRAW' && matchWithLineups.result) {
            const losingTeam = winningTeam === 'A' ? matchWithLineups.teamB : matchWithLineups.teamA;
            if (losingTeam) {
                losingTeam.players.forEach((player) => {
                    const payment = paymentMap.get(player.id);
                    losingTeamPlayers.push({
                        userId: player.id,
                        userName: player.name,
                        amount: payment?.amount || matchWithLineups.matchFee,
                        isPaid: payment?.isPaid || false,
                    });
                });
            }
        }
        return {
            matchId: matchWithLineups.id,
            matchDate: matchWithLineups.matchDate,
            location: matchWithLineups.location,
            status: matchWithLineups.status,
            matchFee: matchWithLineups.matchFee,
            result: matchWithLineups.result,
            winningTeam,
            teamA: matchWithLineups.teamA
                ? {
                    id: matchWithLineups.teamA.id,
                    players: mapPlayersWithPayment(matchWithLineups.teamA.players),
                    totalSkillLevel: matchWithLineups.teamA.totalSkillLevel,
                }
                : undefined,
            teamB: matchWithLineups.teamB
                ? {
                    id: matchWithLineups.teamB.id,
                    players: mapPlayersWithPayment(matchWithLineups.teamB.players),
                    totalSkillLevel: matchWithLineups.teamB.totalSkillLevel,
                }
                : undefined,
            losingTeamPlayers: losingTeamPlayers.length > 0 ? losingTeamPlayers : undefined,
            notes: matchWithLineups.notes,
            createdAt: matchWithLineups.createdAt,
            updatedAt: matchWithLineups.updatedAt,
        };
    }
    async processLosingTeam(matchId) {
        const matchWithLineups = await this.matchesService.findMatchById(matchId);
        if (!matchWithLineups) {
            throw new common_1.NotFoundException('Match not found');
        }
        if (!matchWithLineups.result) {
            throw new common_1.BadRequestException('Match chưa có kết quả');
        }
        const { teamAScore, teamBScore } = matchWithLineups.result;
        let losingTeam = null;
        if (teamAScore > teamBScore) {
            losingTeam = 'B';
        }
        else if (teamBScore > teamAScore) {
            losingTeam = 'A';
        }
        else {
            throw new common_1.BadRequestException('Trận đấu hòa, không có team thua');
        }
        const losingTeamData = losingTeam === 'A' ? matchWithLineups.teamA : matchWithLineups.teamB;
        if (!losingTeamData) {
            throw new common_1.BadRequestException('Không tìm thấy thông tin team thua');
        }
        const existingPayments = await this.fundsRepository.findMatchPaymentsByMatch(matchId);
        if (existingPayments.length > 0) {
            return existingPayments.map((p) => this.toMatchPaymentResponseDto(p));
        }
        const matchFee = matchWithLineups.matchFee;
        const payments = [];
        for (const player of losingTeamData.players) {
            const payment = await this.fundsRepository.createMatchPayment({
                userId: player.id,
                matchId,
                amount: matchFee,
                isPaid: false,
                note: `Tiền thua trận ${matchWithLineups.location} - ${new Date(matchWithLineups.matchDate).toLocaleDateString('vi-VN')}`,
            });
            payments.push(this.toMatchPaymentResponseDto(payment));
        }
        return payments;
    }
    toMatchPaymentResponseDto(payment) {
        return {
            id: payment._id.toString(),
            userId: extractUserId(payment.user),
            userName: extractUserName(payment.user),
            matchId: extractMatchId(payment.match),
            matchDate: extractMatchDate(payment.match),
            amount: payment.amount,
            isPaid: payment.isPaid,
            paidAt: payment.paidAt,
            note: payment.note,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    }
    toExpenseResponseDto(expense) {
        return {
            id: expense._id.toString(),
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            matchId: expense.match ? extractMatchId(expense.match) : undefined,
            matchDate: expense.match ? extractMatchDate(expense.match) : undefined,
            date: expense.date,
            note: expense.note,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
        };
    }
    toMonthlyFeeResponseDto(fee) {
        return {
            id: fee._id.toString(),
            userId: extractUserId(fee.user),
            userName: extractUserName(fee.user),
            month: fee.month,
            year: fee.year,
            amount: fee.amount,
            isPaid: fee.isPaid,
            paidAt: fee.paidAt,
            note: fee.note,
            createdAt: fee.createdAt,
            updatedAt: fee.updatedAt,
        };
    }
    toPenaltyResponseDto(penalty) {
        return {
            id: penalty._id.toString(),
            userId: extractUserId(penalty.user),
            userName: extractUserName(penalty.user),
            matchId: extractMatchId(penalty.match),
            matchDate: extractMatchDate(penalty.match),
            amount: penalty.amount,
            reason: penalty.reason,
            description: penalty.description,
            isPaid: penalty.isPaid,
            paidAt: penalty.paidAt,
            createdAt: penalty.createdAt,
            updatedAt: penalty.updatedAt,
        };
    }
};
exports.FundsService = FundsService;
exports.FundsService = FundsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => matches_service_js_1.MatchesService))),
    __metadata("design:paramtypes", [funds_repository_js_1.FundsRepository,
        matches_service_js_1.MatchesService,
        users_service_js_1.UsersService])
], FundsService);
//# sourceMappingURL=funds.service.js.map