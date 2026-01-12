import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Match } from '../../matches/schemas/match.schema.js';

export enum ExpenseCategory {
  FIELD_RENTAL = 'field_rental', // Tiền sân
  DRINKS = 'drinks', // Nước uống
  EQUIPMENT = 'equipment', // Dụng cụ (bóng, lưới...)
  OTHER = 'other', // Khác
}

export type ExpenseDocument = HydratedDocument<Expense> & {
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Chi tiêu - để tính Tổng Chi trong bảng Thu-Chi
 */
@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({
    type: String,
    enum: ExpenseCategory,
    default: ExpenseCategory.FIELD_RENTAL,
  })
  category: ExpenseCategory;

  @Prop({ type: Types.ObjectId, ref: 'Match' })
  match?: Match | Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop()
  note?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ match: 1 });
