import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FundsController } from './funds.controller.js';
import { FundsService } from './funds.service.js';
import { FundsRepository } from './funds.repository.js';
import { MonthlyFee, MonthlyFeeSchema } from './schemas/monthly-fee.schema.js';
import { Penalty, PenaltySchema } from './schemas/penalty.schema.js';
import {
  MatchPayment,
  MatchPaymentSchema,
} from './schemas/match-payment.schema.js';
import { Expense, ExpenseSchema } from './schemas/expense.schema.js';
import { MatchesModule } from '../matches/matches.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonthlyFee.name, schema: MonthlyFeeSchema },
      { name: Penalty.name, schema: PenaltySchema },
      { name: MatchPayment.name, schema: MatchPaymentSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
    forwardRef(() => MatchesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [FundsController],
  providers: [FundsService, FundsRepository],
  exports: [FundsService, FundsRepository],
})
export class FundsModule {}
