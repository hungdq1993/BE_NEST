import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';
import { PaymentsRepository } from './payments.repository.js';
import { VnpayService } from './providers/vnpay.service.js';
import { MomoService } from './providers/momo.service.js';
import { VietQrService } from './providers/vietqr.service.js';
import { CassoService } from './providers/casso.service.js';
import { Payment, PaymentSchema } from './schemas/payment.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentsRepository,
    VnpayService,
    MomoService,
    VietQrService,
    CassoService,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
