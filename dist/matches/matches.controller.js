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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const matches_service_js_1 = require("./matches.service.js");
const create_match_dto_js_1 = require("./dto/create-match.dto.js");
const update_match_result_dto_js_1 = require("./dto/update-match-result.dto.js");
const split_team_dto_js_1 = require("./dto/split-team.dto.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const match_schema_js_1 = require("./schemas/match.schema.js");
let MatchesController = class MatchesController {
    matchesService;
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    async createMatch(createDto) {
        return this.matchesService.createMatch(createDto);
    }
    async findAllMatches(status) {
        if (status) {
            return this.matchesService.findMatchesByStatus(status);
        }
        return this.matchesService.findAllMatches();
    }
    async findMatch(id) {
        return this.matchesService.findMatchById(id);
    }
    async updateResult(id, updateDto) {
        return this.matchesService.updateMatchResult(id, updateDto);
    }
    async cancelMatch(id) {
        return this.matchesService.cancelMatch(id);
    }
    async deleteMatch(id) {
        return this.matchesService.deleteMatch(id);
    }
    async splitTeams(id, splitDto) {
        return this.matchesService.splitTeams(id, splitDto);
    }
    async findMatchHistoryByUser(userId) {
        return this.matchesService.findMatchHistoryByUser(userId);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_match_dto_js_1.CreateMatchDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "createMatch", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "findAllMatches", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "findMatch", null);
__decorate([
    (0, common_1.Patch)(':id/result'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_match_result_dto_js_1.UpdateMatchResultDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "updateResult", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "cancelMatch", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "deleteMatch", null);
__decorate([
    (0, common_1.Post)(':id/split-teams'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, split_team_dto_js_1.SplitTeamDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "splitTeams", null);
__decorate([
    (0, common_1.Get)('user/:userId/history'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "findMatchHistoryByUser", null);
exports.MatchesController = MatchesController = __decorate([
    (0, common_1.Controller)('matches'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    __metadata("design:paramtypes", [matches_service_js_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map