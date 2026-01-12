import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Payment,
  PaymentDocument,
  PaymentStatus,
} from './schemas/payment.schema.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createDto: CreatePaymentDto): Promise<PaymentDocument> {
    const payment = new this.paymentModel({
      user: new Types.ObjectId(createDto.userId),
      amount: createDto.amount,
      type: createDto.type,
      method: createDto.method,
      reference: createDto.referenceId
        ? new Types.ObjectId(createDto.referenceId)
        : undefined,
      referenceModel: createDto.referenceModel,
      description: createDto.description,
    });
    return payment.save();
  }

  async findAll(): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<PaymentDocument | null> {
    return this.paymentModel.findById(id).populate('user', 'name email').exec();
  }

  async findByUser(userId: string): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStatus(status: PaymentStatus): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ status })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByTransactionId(
    transactionId: string,
  ): Promise<PaymentDocument | null> {
    return this.paymentModel.findOne({ transactionId }).exec();
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
    transactionId?: string,
  ): Promise<PaymentDocument | null> {
    const update: any = { status };
    if (transactionId) update.transactionId = transactionId;
    if (status === PaymentStatus.COMPLETED) update.paidAt = new Date();
    return this.paymentModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
  }

  async delete(id: string): Promise<PaymentDocument | null> {
    return this.paymentModel.findByIdAndDelete(id).exec();
  }

  async getSummaryByUser(userId: string): Promise<{
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    paymentCount: number;
  }> {
    const result = await this.paymentModel.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          paidAmount: {
            $sum: {
              $cond: [
                { $eq: ['$status', PaymentStatus.COMPLETED] },
                '$amount',
                0,
              ],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [
                { $eq: ['$status', PaymentStatus.PENDING] },
                '$amount',
                0,
              ],
            },
          },
          paymentCount: { $sum: 1 },
        },
      },
    ]);

    return (
      result[0] || {
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        paymentCount: 0,
      }
    );
  }
}
