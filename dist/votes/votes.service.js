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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const votes_repository_js_1 = require("./votes.repository.js");
const vote_session_schema_js_1 = require("./schemas/vote-session.schema.js");
const vote_response_schema_js_1 = require("./schemas/vote-response.schema.js");
let VotesService = class VotesService {
    votesRepository;
    constructor(votesRepository) {
        this.votesRepository = votesRepository;
    }
    async createSession(createDto, userId) {
        const deadline = new Date(createDto.deadline);
        const matchDate = new Date(createDto.matchDate);
        if (deadline >= matchDate) {
            throw new common_1.BadRequestException('Deadline must be before match date');
        }
        const session = await this.votesRepository.createSession(createDto, userId);
        return this.toSessionResponseDto(session);
    }
    async findAllSessions() {
        const sessions = await this.votesRepository.findAllSessions();
        return sessions.map((s) => this.toSessionResponseDto(s));
    }
    async findOpenSessions() {
        const sessions = await this.votesRepository.findOpenSessions();
        return sessions.map((s) => this.toSessionResponseDto(s));
    }
    async findSessionById(id) {
        const session = await this.votesRepository.findSessionById(id);
        if (!session) {
            throw new common_1.NotFoundException('Vote session not found');
        }
        return this.toSessionResponseDto(session);
    }
    async closeSession(id) {
        const session = await this.votesRepository.updateSessionStatus(id, vote_session_schema_js_1.VoteStatus.CLOSED);
        if (!session) {
            throw new common_1.NotFoundException('Vote session not found');
        }
        return this.toSessionResponseDto(session);
    }
    async cancelSession(id) {
        const session = await this.votesRepository.updateSessionStatus(id, vote_session_schema_js_1.VoteStatus.CANCELLED);
        if (!session) {
            throw new common_1.NotFoundException('Vote session not found');
        }
        return this.toSessionResponseDto(session);
    }
    async deleteSession(id) {
        await this.votesRepository.deleteVotesBySession(id);
        const session = await this.votesRepository.deleteSession(id);
        if (!session) {
            throw new common_1.NotFoundException('Vote session not found');
        }
    }
    async submitVote(submitDto, userId) {
        const session = await this.votesRepository.findSessionById(submitDto.sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Vote session not found');
        }
        if (session.status !== vote_session_schema_js_1.VoteStatus.OPEN) {
            throw new common_1.BadRequestException('Vote session is not open');
        }
        if (new Date() > session.deadline) {
            throw new common_1.BadRequestException('Vote deadline has passed');
        }
        const vote = await this.votesRepository.submitVote(submitDto.sessionId, userId, submitDto.choice, submitDto.note);
        return this.toVoteResponseDto(vote);
    }
    async getSessionStats(sessionId) {
        const session = await this.votesRepository.findSessionById(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Vote session not found');
        }
        const votes = await this.votesRepository.findVotesBySession(sessionId);
        const voteCounts = await this.votesRepository.countVotesByChoice(sessionId);
        const countMap = new Map(voteCounts.map((v) => [v.choice, v.count]));
        const voters = votes.map((v) => ({
            userId: v.user.toString(),
            userName: v.user.name,
            choice: v.choice,
            votedAt: v.createdAt,
        }));
        return {
            sessionId: session._id.toString(),
            matchDate: session.matchDate,
            deadline: session.deadline,
            status: session.status,
            totalVotes: votes.length,
            yesCount: countMap.get(vote_response_schema_js_1.VoteChoice.YES) || 0,
            noCount: countMap.get(vote_response_schema_js_1.VoteChoice.NO) || 0,
            maybeCount: countMap.get(vote_response_schema_js_1.VoteChoice.MAYBE) || 0,
            voters,
        };
    }
    async getUserVote(sessionId, userId) {
        const vote = await this.votesRepository.findUserVote(sessionId, userId);
        return vote ? this.toVoteResponseDto(vote) : null;
    }
    toSessionResponseDto(session) {
        let createdById = 'unknown';
        if (session.createdBy != null) {
            if (typeof session.createdBy === 'object' && '_id' in session.createdBy) {
                createdById = String(session.createdBy._id);
            }
            else if (session.createdBy instanceof mongoose_1.Types.ObjectId) {
                createdById = session.createdBy.toString();
            }
        }
        return {
            id: session._id.toString(),
            matchDate: session.matchDate,
            deadline: session.deadline,
            status: session.status,
            description: session.description,
            location: session.location,
            createdBy: createdById,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        };
    }
    toVoteResponseDto(vote) {
        return {
            id: vote._id.toString(),
            sessionId: vote.session.toString(),
            userId: vote.user.toString(),
            choice: vote.choice,
            note: vote.note,
            createdAt: vote.createdAt,
            updatedAt: vote.updatedAt,
        };
    }
};
exports.VotesService = VotesService;
exports.VotesService = VotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [votes_repository_js_1.VotesRepository])
], VotesService);
//# sourceMappingURL=votes.service.js.map