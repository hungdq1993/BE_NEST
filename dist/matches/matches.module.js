"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const matches_controller_js_1 = require("./matches.controller.js");
const matches_service_js_1 = require("./matches.service.js");
const matches_repository_js_1 = require("./matches.repository.js");
const team_splitter_service_js_1 = require("./team-splitter.service.js");
const match_schema_js_1 = require("./schemas/match.schema.js");
const team_lineup_schema_js_1 = require("./schemas/team-lineup.schema.js");
const users_module_js_1 = require("../users/users.module.js");
const funds_module_js_1 = require("../funds/funds.module.js");
let MatchesModule = class MatchesModule {
};
exports.MatchesModule = MatchesModule;
exports.MatchesModule = MatchesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: match_schema_js_1.Match.name, schema: match_schema_js_1.MatchSchema },
                { name: team_lineup_schema_js_1.TeamLineup.name, schema: team_lineup_schema_js_1.TeamLineupSchema },
            ]),
            (0, common_1.forwardRef)(() => users_module_js_1.UsersModule),
            (0, common_1.forwardRef)(() => funds_module_js_1.FundsModule),
        ],
        controllers: [matches_controller_js_1.MatchesController],
        providers: [matches_service_js_1.MatchesService, matches_repository_js_1.MatchesRepository, team_splitter_service_js_1.TeamSplitterService],
        exports: [matches_service_js_1.MatchesService, matches_repository_js_1.MatchesRepository],
    })
], MatchesModule);
//# sourceMappingURL=matches.module.js.map