"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const funds_controller_js_1 = require("./funds.controller.js");
const funds_service_js_1 = require("./funds.service.js");
const funds_repository_js_1 = require("./funds.repository.js");
const monthly_fee_schema_js_1 = require("./schemas/monthly-fee.schema.js");
const penalty_schema_js_1 = require("./schemas/penalty.schema.js");
const match_payment_schema_js_1 = require("./schemas/match-payment.schema.js");
const expense_schema_js_1 = require("./schemas/expense.schema.js");
const matches_module_js_1 = require("../matches/matches.module.js");
const users_module_js_1 = require("../users/users.module.js");
let FundsModule = class FundsModule {
};
exports.FundsModule = FundsModule;
exports.FundsModule = FundsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: monthly_fee_schema_js_1.MonthlyFee.name, schema: monthly_fee_schema_js_1.MonthlyFeeSchema },
                { name: penalty_schema_js_1.Penalty.name, schema: penalty_schema_js_1.PenaltySchema },
                { name: match_payment_schema_js_1.MatchPayment.name, schema: match_payment_schema_js_1.MatchPaymentSchema },
                { name: expense_schema_js_1.Expense.name, schema: expense_schema_js_1.ExpenseSchema },
            ]),
            (0, common_1.forwardRef)(() => matches_module_js_1.MatchesModule),
            (0, common_1.forwardRef)(() => users_module_js_1.UsersModule),
        ],
        controllers: [funds_controller_js_1.FundsController],
        providers: [funds_service_js_1.FundsService, funds_repository_js_1.FundsRepository],
        exports: [funds_service_js_1.FundsService, funds_repository_js_1.FundsRepository],
    })
], FundsModule);
//# sourceMappingURL=funds.module.js.map