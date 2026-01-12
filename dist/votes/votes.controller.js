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
exports.VotesController = void 0;
const common_1 = require("@nestjs/common");
const votes_service_js_1 = require("./votes.service.js");
const create_vote_session_dto_js_1 = require("./dto/create-vote-session.dto.js");
const submit_vote_dto_js_1 = require("./dto/submit-vote.dto.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
let VotesController = class VotesController {
    votesService;
    constructor(votesService) {
        this.votesService = votesService;
    }
    async createSession(createDto, user) {
        return this.votesService.createSession(createDto, user.sub);
    }
    async findAllSessions() {
        return this.votesService.findAllSessions();
    }
    async findOpenSessions() {
        return this.votesService.findOpenSessions();
    }
    async findSession(id) {
        return this.votesService.findSessionById(id);
    }
    async getSessionStats(id) {
        return this.votesService.getSessionStats(id);
    }
    async closeSession(id) {
        return this.votesService.closeSession(id);
    }
    async cancelSession(id) {
        return this.votesService.cancelSession(id);
    }
    async deleteSession(id) {
        return this.votesService.deleteSession(id);
    }
    async submitVote(submitDto, user) {
        return this.votesService.submitVote(submitDto, user.sub);
    }
    async getMyVote(id, user) {
        return this.votesService.getUserVote(id, user.sub);
    }
};
exports.VotesController = VotesController;
__decorate([
    (0, common_1.Post)('sessions'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vote_session_dto_js_1.CreateVoteSessionDto, Object]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "findAllSessions", null);
__decorate([
    (0, common_1.Get)('sessions/open'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "findOpenSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "findSession", null);
__decorate([
    (0, common_1.Get)('sessions/:id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "getSessionStats", null);
__decorate([
    (0, common_1.Patch)('sessions/:id/close'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "closeSession", null);
__decorate([
    (0, common_1.Patch)('sessions/:id/cancel'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN, roles_decorator_js_1.Role.CAPTAIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "cancelSession", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    (0, roles_decorator_js_1.Roles)(roles_decorator_js_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submit_vote_dto_js_1.SubmitVoteDto, Object]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "submitVote", null);
__decorate([
    (0, common_1.Get)('sessions/:id/my-vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "getMyVote", null);
exports.VotesController = VotesController = __decorate([
    (0, common_1.Controller)('votes'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    __metadata("design:paramtypes", [votes_service_js_1.VotesService])
], VotesController);
//# sourceMappingURL=votes.controller.js.map