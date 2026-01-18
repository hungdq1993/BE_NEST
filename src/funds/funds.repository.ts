import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MonthlyFee,
  MonthlyFeeDocument,
} from './schemas/monthly-fee.schema.js';
import {
  Penalty,
  PenaltyDocument,
  PenaltyReason,
} from './schemas/penalty.schema.js';
import {
  MatchPayment,
  MatchPaymentDocument,
} from './schemas/match-payment.schema.js';
import {
  Expense,
  ExpenseDocument,
  ExpenseCategory,
} from './schemas/expense.schema.js';
import {
  FundBalance,
  FundBalanceDocument,
} from './schemas/fund-balance.schema.js';
import {
  CreateMonthlyFeeDto,
  CreatePenaltyDto,
  BulkCreateMonthlyFeeDto,
} from './dto/fund-stats.dto.js';
import {
  CreateMatchPaymentDto,
  BulkCreateMatchPaymentDto,
} from './dto/match-payment.dto.js';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto.js';

@Injectable()
export class FundsRepository {
  constructor(
    @InjectModel(MonthlyFee.name)
    private readonly monthlyFeeModel: Model<MonthlyFeeDocument>,
    @InjectModel(Penalty.name)
    private readonly penaltyModel: Model<PenaltyDocument>,
    @InjectModel(MatchPayment.name)
    private readonly matchPaymentModel: Model<MatchPaymentDocument>,
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(FundBalance.name)
    private readonly fundBalanceModel: Model<FundBalanceDocument>,
  ) {}

  // ==================== MATCH PAYMENT METHODS ====================

  async createMatchPayment(
    dto: CreateMatchPaymentDto,
  ): Promise<MatchPaymentDocument> {
    const payment = new this.matchPaymentModel({
      user: new Types.ObjectId(dto.userId),
      match: new Types.ObjectId(dto.matchId),
      amount: dto.amount,
      isPaid: dto.isPaid || false,
      note: dto.note,
    });
    return payment.save();
  }

  async bulkCreateMatchPayments(
    dto: BulkCreateMatchPaymentDto,
  ): Promise<MatchPaymentDocument[]> {
    const payments = dto.players.map((player) => ({
      user: new Types.ObjectId(player.userId),
      match: new Types.ObjectId(dto.matchId),
      amount: player.amount,
      isPaid: player.isPaid || false,
    }));
    return this.matchPaymentModel.insertMany(payments);
  }

  async findMatchPaymentsByMatch(
    matchId: string,
  ): Promise<MatchPaymentDocument[]> {
    return this.matchPaymentModel
      .find({ match: new Types.ObjectId(matchId) })
      .populate('user', 'name email')
      .exec();
  }

  async findMatchPaymentsByUser(
    userId: string,
  ): Promise<MatchPaymentDocument[]> {
    return this.matchPaymentModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('match', 'matchDate location')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllMatchPayments(): Promise<MatchPaymentDocument[]> {
    return this.matchPaymentModel
      .find()
      .populate('user', 'name email')
      .populate('match', 'matchDate location')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnpaidMatchPayments(): Promise<MatchPaymentDocument[]> {
    return this.matchPaymentModel
      .find({ isPaid: false })
      .populate('user', 'name email')
      .populate('match', 'matchDate location')
      .exec();
  }

  async markMatchPaymentPaid(id: string): Promise<MatchPaymentDocument | null> {
    return this.matchPaymentModel
      .findByIdAndUpdate(
        id,
        { isPaid: true, paidAt: new Date() },
        { new: true },
      )
      .exec();
  }

  // Đánh dấu đã thanh toán match payments hàng loạt theo userIds
  async bulkMarkMatchPaymentPaid(
    userIds: string[],
    matchId?: string,
  ): Promise<MatchPaymentDocument[]> {
    const now = new Date();
    const filter: Record<string, unknown> = {
      user: { $in: userIds.map((id) => new Types.ObjectId(id)) },
      isPaid: false,
    };

    // Nếu có matchId thì chỉ thanh toán cho trận đó
    if (matchId) {
      filter.match = new Types.ObjectId(matchId);
    }

    await this.matchPaymentModel.updateMany(filter, {
      $set: { isPaid: true, paidAt: now },
    });

    // Trả về tất cả payments của users (đã update)
    const resultFilter: Record<string, unknown> = {
      user: { $in: userIds.map((id) => new Types.ObjectId(id)) },
    };
    if (matchId) {
      resultFilter.match = new Types.ObjectId(matchId);
    }

    return this.matchPaymentModel
      .find(resultFilter)
      .populate('user', 'name email')
      .populate('match', 'matchDate location')
      .exec();
  }

  async deleteMatchPayment(id: string): Promise<MatchPaymentDocument | null> {
    return this.matchPaymentModel.findByIdAndDelete(id).exec();
  }

  async deleteMatchPaymentsByMatch(matchId: string): Promise<number> {
    const result = await this.matchPaymentModel
      .deleteMany({ match: new Types.ObjectId(matchId) })
      .exec();
    return result.deletedCount;
  }

  async getMatchPaymentStats(): Promise<{
    total: number;
    paid: number;
    unpaid: number;
  }> {
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

    if (
      Array.isArray(result) &&
      typeof result[0] === 'object' &&
      result[0] !== null
    ) {
      const stats = result[0] as {
        total?: number;
        paid?: number;
        unpaid?: number;
      };
      const total = typeof stats.total === 'number' ? stats.total : 0;
      const paid = typeof stats.paid === 'number' ? stats.paid : 0;
      const unpaid = typeof stats.unpaid === 'number' ? stats.unpaid : 0;
      return { total, paid, unpaid };
    }

    return { total: 0, paid: 0, unpaid: 0 };
  }

  // ==================== EXPENSE METHODS ====================

  async createExpense(dto: CreateExpenseDto): Promise<ExpenseDocument> {
    const expense = new this.expenseModel({
      description: dto.description,
      amount: dto.amount,
      category: dto.category || ExpenseCategory.FIELD_RENTAL,
      match: dto.matchId ? new Types.ObjectId(dto.matchId) : undefined,
      date: new Date(dto.date),
      note: dto.note,
    });
    return expense.save();
  }

  async findAllExpenses(
    startDate?: string,
    endDate?: string,
    category?: string,
  ): Promise<ExpenseDocument[]> {
    const filter: Record<string, unknown> = {};

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        (filter.date as Record<string, Date>).$gte = new Date(startDate);
      }
      if (endDate) {
        (filter.date as Record<string, Date>).$lte = new Date(endDate);
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

  async findExpensesByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseDocument[]> {
    return this.expenseModel
      .find({ date: { $gte: startDate, $lte: endDate } })
      .populate('match', 'matchDate location')
      .sort({ date: -1 })
      .exec();
  }

  async findExpensesByMatch(matchId: string): Promise<ExpenseDocument[]> {
    return this.expenseModel
      .find({ match: new Types.ObjectId(matchId) })
      .exec();
  }

  async updateExpense(
    id: string,
    dto: UpdateExpenseDto,
  ): Promise<ExpenseDocument | null> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.matchId) {
      updateData.match = new Types.ObjectId(dto.matchId);
      delete updateData.matchId;
    }
    if (dto.date) {
      updateData.date = new Date(dto.date);
    }
    return this.expenseModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteExpense(id: string): Promise<ExpenseDocument | null> {
    return this.expenseModel.findByIdAndDelete(id).exec();
  }

  async getExpenseStats(): Promise<{
    total: number;
    byCategory: { category: string; amount: number }[];
  }> {
    const result = await this.expenseModel.aggregate<{
      _id: string;
      amount: number;
    }>([
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

  // ==================== MONTHLY FEE METHODS ====================

  async createMonthlyFee(
    dto: CreateMonthlyFeeDto,
  ): Promise<MonthlyFeeDocument> {
    const fee = new this.monthlyFeeModel({
      user: new Types.ObjectId(dto.userId),
      month: dto.month,
      year: dto.year,
      amount: dto.amount,
      note: dto.note,
    });
    return fee.save();
  }

  async bulkCreateMonthlyFees(
    dto: BulkCreateMonthlyFeeDto,
    users: Array<{ userId: string; isStudent: boolean }>,
    studentAmount: number,
  ): Promise<MonthlyFeeDocument[]> {
    if (users.length === 0) {
      return [];
    }

    // Tạo array fees cho tất cả users với số tiền tương ứng
    const feesToCreate = users.map((user) => ({
      user: new Types.ObjectId(user.userId),
      month: dto.month,
      year: dto.year,
      amount: user.isStudent ? studentAmount : dto.amount,
      note: dto.note,
    }));

    // Sử dụng insertMany với ordered: false để skip duplicates
    // Nếu có duplicate (unique index), sẽ skip và tiếp tục với các record khác
    try {
      const result = await this.monthlyFeeModel.insertMany(feesToCreate, {
        ordered: false,
      });
      // Populate user sau khi insert
      const ids = result.map((fee) => fee._id);
      return this.monthlyFeeModel
        .find({ _id: { $in: ids } })
        .populate('user', 'name email')
        .exec();
    } catch (error) {
      // Nếu có lỗi duplicate, vẫn trả về các fees đã tạo thành công
      if (
        error &&
        typeof error === 'object' &&
        'insertedIds' in error &&
        error.insertedIds &&
        typeof error.insertedIds === 'object'
      ) {
        // Lấy các IDs đã insert thành công
        const insertedIds = Object.values(error.insertedIds) as Types.ObjectId[];
        if (insertedIds.length > 0) {
          return this.monthlyFeeModel
            .find({
              _id: { $in: insertedIds },
            })
            .populate('user', 'name email')
            .exec();
        }
      }
      // Nếu không có insertedIds hoặc tất cả đều duplicate
      // Trả về fees hiện có cho period này (bao gồm cả những cái đã tồn tại)
      return this.findMonthlyFeesByPeriod(dto.month, dto.year);
    }
  }

  async findAllMonthlyFees(): Promise<MonthlyFeeDocument[]> {
    return this.monthlyFeeModel
      .find()
      .populate('user', 'name email')
      .sort({ year: -1, month: -1 })
      .exec();
  }

  async findMonthlyFeesByUser(userId: string): Promise<MonthlyFeeDocument[]> {
    return this.monthlyFeeModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ year: -1, month: -1 })
      .exec();
  }

  async findMonthlyFeesByPeriod(
    month: number,
    year: number,
  ): Promise<MonthlyFeeDocument[]> {
    return this.monthlyFeeModel
      .find({ month, year })
      .populate('user', 'name email')
      .exec();
  }

  async findUnpaidMonthlyFees(): Promise<MonthlyFeeDocument[]> {
    return this.monthlyFeeModel
      .find({ isPaid: false })
      .populate('user', 'name email')
      .sort({ year: -1, month: -1 })
      .exec();
  }

  async findUnpaidMonthlyFeesByYear(year: number): Promise<MonthlyFeeDocument[]> {
    return this.monthlyFeeModel
      .find({ isPaid: false, year })
      .populate('user', 'name email')
      .sort({ month: -1 })
      .exec();
  }

  async findMonthlyFeesByYear(year: number): Promise<MonthlyFeeDocument[]> {
    return this.monthlyFeeModel
      .find({ year })
      .populate('user', 'name email avatar skillLevel isStudent')
      .sort({ month: 1 })
      .exec();
  }

  async markMonthlyFeePaid(id: string): Promise<MonthlyFeeDocument | null> {
    return this.monthlyFeeModel
      .findByIdAndUpdate(
        id,
        { isPaid: true, paidAt: new Date() },
        { new: true },
      )
      .populate('user', 'name email')
      .exec();
  }

  // Đánh dấu đã thanh toán hàng loạt theo userIds và period
  async bulkMarkMonthlyFeePaid(
    userIds: string[],
    month: number,
    year: number,
  ): Promise<MonthlyFeeDocument[]> {
    const now = new Date();
    await this.monthlyFeeModel.updateMany(
      {
        user: { $in: userIds.map((id) => new Types.ObjectId(id)) },
        month,
        year,
        isPaid: false,
      },
      {
        $set: { isPaid: true, paidAt: now },
      },
    );

    return this.monthlyFeeModel
      .find({
        user: { $in: userIds.map((id) => new Types.ObjectId(id)) },
        month,
        year,
      })
      .populate('user', 'name email')
      .exec();
  }

  // Tạo và mark paid monthly fee (dùng khi user chưa có fee record)
  async createAndPayMonthlyFee(
    dto: CreateMonthlyFeeDto,
  ): Promise<MonthlyFeeDocument> {
    const fee = new this.monthlyFeeModel({
      user: new Types.ObjectId(dto.userId),
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
      .exec() as Promise<MonthlyFeeDocument>;
  }

  async deleteMonthlyFee(id: string): Promise<MonthlyFeeDocument | null> {
    return this.monthlyFeeModel.findByIdAndDelete(id).exec();
  }

  // ==================== PENALTY METHODS ====================

  async createPenalty(dto: CreatePenaltyDto): Promise<PenaltyDocument> {
    const penalty = new this.penaltyModel({
      user: new Types.ObjectId(dto.userId),
      match: new Types.ObjectId(dto.matchId),
      amount: dto.amount,
      reason: dto.reason as PenaltyReason,
      description: dto.description,
    });
    return penalty.save();
  }

  async findAllPenalties(): Promise<PenaltyDocument[]> {
    return this.penaltyModel
      .find()
      .populate('user', 'name email')
      .populate('match', 'matchDate location')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPenaltiesByUser(userId: string): Promise<PenaltyDocument[]> {
    return this.penaltyModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('match', 'matchDate location')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPenaltiesByMatch(matchId: string): Promise<PenaltyDocument[]> {
    return this.penaltyModel
      .find({ match: new Types.ObjectId(matchId) })
      .populate('user', 'name email')
      .exec();
  }

  async findUnpaidPenalties(): Promise<PenaltyDocument[]> {
    return this.penaltyModel
      .find({ isPaid: false })
      .populate('user', 'name email')
      .populate('match', 'matchDate location')
      .sort({ createdAt: -1 })
      .exec();
  }

  async markPenaltyPaid(id: string): Promise<PenaltyDocument | null> {
    return this.penaltyModel
      .findByIdAndUpdate(
        id,
        { isPaid: true, paidAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async deletePenalty(id: string): Promise<PenaltyDocument | null> {
    return this.penaltyModel.findByIdAndDelete(id).exec();
  }

  async deletePenaltiesByMatch(matchId: string): Promise<number> {
    const result = await this.penaltyModel
      .deleteMany({ match: new Types.ObjectId(matchId) })
      .exec();
    return result.deletedCount;
  }

  // ==================== AGGREGATION METHODS ====================

  async getMonthlyFeeStats(): Promise<
    {
      _id: { month: number; year: number };
      collected: number;
      pending: number;
      paidCount: number;
      unpaidCount: number;
    }[]
  > {
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

  async getPenaltyStats(): Promise<{
    totalPenalties: number;
    collectedPenalties: number;
    pendingPenalties: number;
  }> {
    const result = await this.penaltyModel.aggregate<{
      totalPenalties: number;
      collectedPenalties: number;
      pendingPenalties: number;
    }>([
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
    return (
      result[0] ?? {
        totalPenalties: 0,
        collectedPenalties: 0,
        pendingPenalties: 0,
      }
    );
  }

  async getUserFundSummary(userId: string): Promise<{
    monthlyFees: { total: number; paid: number; pending: number };
    penalties: { total: number; paid: number; pending: number };
    matchPayments: { total: number; paid: number; pending: number };
  }> {
    type FundSummary = { total: number; paid: number; pending: number };

    const [monthlyFeeResult, penaltyResult, matchPaymentResult] =
      await Promise.all([
        this.monthlyFeeModel.aggregate<FundSummary>([
          { $match: { user: new Types.ObjectId(userId) } },
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
        this.penaltyModel.aggregate<FundSummary>([
          { $match: { user: new Types.ObjectId(userId) } },
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
        this.matchPaymentModel.aggregate<FundSummary>([
          { $match: { user: new Types.ObjectId(userId) } },
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

  // Lấy chi tiết nợ của user
  async getUserDebtDetail(userId: string): Promise<{
    unpaidMonthlyFees: MonthlyFeeDocument[];
    unpaidMatchPayments: MatchPaymentDocument[];
    unpaidPenalties: PenaltyDocument[];
  }> {
    const [unpaidMonthlyFees, unpaidMatchPayments, unpaidPenalties] =
      await Promise.all([
        this.monthlyFeeModel
          .find({ user: new Types.ObjectId(userId), isPaid: false })
          .sort({ year: -1, month: -1 })
          .exec(),
        this.matchPaymentModel
          .find({ user: new Types.ObjectId(userId), isPaid: false })
          .populate('match', 'matchDate location')
          .sort({ createdAt: -1 })
          .exec(),
        this.penaltyModel
          .find({ user: new Types.ObjectId(userId), isPaid: false })
          .populate('match', 'matchDate location')
          .sort({ createdAt: -1 })
          .exec(),
      ]);

    return { unpaidMonthlyFees, unpaidMatchPayments, unpaidPenalties };
  }

  // Tổng hợp Thu-Chi
  async getFundSummary(): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    totalPending: number;
    manualBalance: number | null;
    manualBalanceSetAt: Date | null;
    incomeBreakdown: {
      matchPayments: number;
      monthlyFees: number;
      penalties: number;
    };
    expenseBreakdown: {
      fieldRental: number;
      drinks: number;
      equipment: number;
      other: number;
    };
    pendingBreakdown: {
      matchPayments: number;
      monthlyFees: number;
      penalties: number;
    };
  }> {
    // 1. Lấy manual fund balance (nếu có)
    const manualFundBalance = await this.fundBalanceModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1);

    const manualBalance = manualFundBalance?.amount ?? null;
    const manualBalanceSetAt = manualFundBalance?.createdAt ?? null;

    // 2. Tạo date filter
    // Đối với thu nhập: filter theo paidAt/updatedAt (thời điểm đóng tiền)
    // Đối với chi phí: filter theo createdAt (thời điểm tạo expense)
    const incomeFilter = manualBalanceSetAt 
      ? { 
          isPaid: true,
          $or: [
            { paidAt: { $gte: manualBalanceSetAt } },
            { 
              paidAt: { $exists: false },
              updatedAt: { $gte: manualBalanceSetAt }
            }
          ]
        }
      : { isPaid: true };

    const expenseFilter = manualBalanceSetAt 
      ? { createdAt: { $gte: manualBalanceSetAt } }
      : {};

    // 3. Tính tổng thu/chi
    const [matchPaymentStats, monthlyFeeStats, penaltyStats, expenseStats] =
      await Promise.all([
        // Match payments (filter theo thời điểm đóng)
        this.matchPaymentModel.aggregate<{ total: number }>([
          { $match: incomeFilter },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        // Monthly fees (filter theo thời điểm đóng)
        this.monthlyFeeModel.aggregate<{ total: number }>([
          { $match: incomeFilter },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        // Penalties (filter theo thời điểm đóng)
        this.penaltyModel.aggregate<{ total: number }>([
          { $match: incomeFilter },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        // Expenses (filter theo thời điểm tạo)
        this.expenseModel.aggregate([
          { $match: expenseFilter },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ]),
      ]);

    const matchPaymentsIncome = (matchPaymentStats[0]?.total as number | undefined) ?? 0;
    const monthlyFeesIncome = (monthlyFeeStats[0]?.total as number | undefined) ?? 0;
    const penaltiesIncome = (penaltyStats[0]?.total as number | undefined) ?? 0;
    const totalIncome = matchPaymentsIncome + monthlyFeesIncome + penaltiesIncome;
    
    const totalExpense = (expenseStats[0]?.total as number | undefined) ?? 0;

    // 4. Tính balance
    let balance: number;
    
    if (manualBalance !== null) {
      // Có manual balance: cộng thêm thu/chi sau thời điểm set
      balance = manualBalance + totalIncome - totalExpense;
    } else {
      // Không có manual balance: tính từ đầu
      balance = totalIncome - totalExpense;
    }

    // 5. Tính expense breakdown (filter theo createdAt)
    const expenseBreakdownStats = await this.expenseModel.aggregate([
      { $match: expenseFilter },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
        },
      },
    ]);

    const expenseBreakdown = {
      fieldRental: 0,
      drinks: 0,
      equipment: 0,
      other: 0,
    };

    expenseBreakdownStats.forEach((item) => {
      const category = item._id as ExpenseCategory;
      switch (category) {
        case ExpenseCategory.FIELD_RENTAL:
          expenseBreakdown.fieldRental = item.amount;
          break;
        case ExpenseCategory.DRINKS:
          expenseBreakdown.drinks = item.amount;
          break;
        case ExpenseCategory.EQUIPMENT:
          expenseBreakdown.equipment = item.amount;
          break;
        default:
          expenseBreakdown.other += item.amount;
      }
    });

    // 6. Tính tổng nợ nhóm (tổng số tiền các thành viên chưa đóng)
    const [unpaidMatchPayments, unpaidMonthlyFees, unpaidPenalties] = await Promise.all([
      this.matchPaymentModel.aggregate<{ total: number }>([
        { $match: { isPaid: false } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.monthlyFeeModel.aggregate<{ total: number }>([
        { $match: { isPaid: false } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.penaltyModel.aggregate<{ total: number }>([
        { $match: { isPaid: false } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const pendingMatchPayments = (unpaidMatchPayments[0]?.total as number | undefined) ?? 0;
    const pendingMonthlyFees = (unpaidMonthlyFees[0]?.total as number | undefined) ?? 0;
    const pendingPenalties = (unpaidPenalties[0]?.total as number | undefined) ?? 0;
    const totalPending = pendingMatchPayments + pendingMonthlyFees + pendingPenalties;

    return {
      totalIncome,
      totalExpense,
      balance,
      totalPending,
      manualBalance,
      manualBalanceSetAt,
      incomeBreakdown: {
        matchPayments: matchPaymentsIncome,
        monthlyFees: monthlyFeesIncome,
        penalties: penaltiesIncome,
      },
      expenseBreakdown,
      pendingBreakdown: {
        matchPayments: pendingMatchPayments,
        monthlyFees: pendingMonthlyFees,
        penalties: pendingPenalties,
      },
    };
  }

  // ==================== FUND BALANCE METHODS ====================

  /**
   * Create a new fund balance record
   * @param amount - The fund balance amount (can be positive or negative)
   * @param setBy - The admin user ID who set the balance
   * @param note - Optional note about the balance
   * @returns The created fund balance document
   */
  async createFundBalance(
    amount: number,
    setBy: string,
    note?: string,
  ): Promise<FundBalanceDocument> {
    try {
      const balance = new this.fundBalanceModel({
        amount,
        setBy: new Types.ObjectId(setBy),
        note,
      });
      return await balance.save();
    } catch (error) {
      throw new Error(`Failed to create fund balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the current (most recent) fund balance
   * @returns The most recent fund balance document or null if none exists
   */
  async getCurrentFundBalance(): Promise<FundBalanceDocument | null> {
    return this.fundBalanceModel
      .findOne()
      .sort({ createdAt: -1 })
      .limit(1)
      .populate('setBy', 'name email')
      .exec();
  }

  // Lấy chi tiết nợ của tất cả users theo tháng
  async getDebtDetailsByMonth(
    month: number,
    year: number,
  ): Promise<{
    monthlyFees: MonthlyFeeDocument[];
    matchPayments: MatchPaymentDocument[];
  }> {
    // Lấy tất cả monthly fees của tháng này
    const monthlyFees = await this.monthlyFeeModel
      .find({ month, year })
      .populate('user', 'name email avatar skillLevel isStudent')
      .exec();

    // Lấy tất cả match payments trong tháng này
    // Tìm các trận có matchDate trong tháng
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Lấy tất cả match payments có match.matchDate trong khoảng thời gian
    const matchPayments = await this.matchPaymentModel
      .find()
      .populate('user', 'name email avatar skillLevel isStudent')
      .populate('match', 'matchDate location')
      .exec();

    // Filter theo matchDate sau khi populate
    const filteredPayments = matchPayments.filter((payment) => {
      if (!payment.match || typeof payment.match !== 'object') return false;
      const match = payment.match as any;
      const matchDate = match.matchDate;
      if (!matchDate) return false;
      const date = new Date(matchDate);
      return date >= startDate && date <= endDate;
    });

    return { monthlyFees, matchPayments: filteredPayments };
  }
}