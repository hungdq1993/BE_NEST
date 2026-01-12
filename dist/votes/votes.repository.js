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
exports.VotesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const vote_session_schema_js_1 = require("./schemas/vote-session.schema.js");
const vote_response_schema_js_1 = require("./schemas/vote-response.schema.js");
let VotesRepository = class VotesRepository {
    voteSessionModel;
    voteResponseModel;
    constructor(voteSessionModel, voteResponseModel) {
        this.voteSessionModel = voteSessionModel;
        this.voteResponseModel = voteResponseModel;
    }
    async createSession(createDto, createdBy) {
        const session = new this.voteSessionModel({
            ...createDto,
            matchDate: new Date(createDto.matchDate),
            deadline: new Date(createDto.deadline),
            createdBy: new mongoose_2.Types.ObjectId(createdBy),
        });
        return session.save();
    }
    async findAllSessions() {
        return this.voteSessionModel
            .find()
            .populate('createdBy', 'name email')
            .sort({ matchDate: -1 })
            .exec();
    }
    async findSessionById(id) {
        return this.voteSessionModel
            .findById(id)
            .populate('createdBy', 'name email')
            .exec();
    }
    async findOpenSessions() {
        return this.voteSessionModel
            .find({ status: vote_session_schema_js_1.VoteStatus.OPEN })
            .populate('createdBy', 'name email')
            .sort({ deadline: 1 })
            .exec();
    }
    async updateSessionStatus(id, status) {
        return this.voteSessionModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
    }
    async deleteSession(id) {
        return this.voteSessionModel.findByIdAndDelete(id).exec();
    }
    async submitVote(sessionId, userId, choice, note) {
        const existingVote = await this.voteResponseModel.findOne({
            session: new mongoose_2.Types.ObjectId(sessionId),
            user: new mongoose_2.Types.ObjectId(userId),
        });
        if (existingVote) {
            existingVote.choice = choice;
            existingVote.note = note;
            return existingVote.save();
        }
        const vote = new this.voteResponseModel({
            session: new mongoose_2.Types.ObjectId(sessionId),
            user: new mongoose_2.Types.ObjectId(userId),
            choice,
            note,
        });
        return vote.save();
    }
    async findVotesBySession(sessionId) {
        return this.voteResponseModel
            .find({ session: new mongoose_2.Types.ObjectId(sessionId) })
            .populate('user', 'name email skillLevel')
            .exec();
    }
    async findUserVote(sessionId, userId) {
        return this.voteResponseModel
            .findOne({
            session: new mongoose_2.Types.ObjectId(sessionId),
            user: new mongoose_2.Types.ObjectId(userId),
        })
            .exec();
    }
    async countVotesByChoice(sessionId) {
        return this.voteResponseModel.aggregate([
            { $match: { session: new mongoose_2.Types.ObjectId(sessionId) } },
            { $group: { _id: '$choice', count: { $sum: 1 } } },
            { $project: { choice: '$_id', count: 1, _id: 0 } },
        ]);
    }
    async deleteVotesBySession(sessionId) {
        await this.voteResponseModel
            .deleteMany({ session: new mongoose_2.Types.ObjectId(sessionId) })
            .exec();
    }
};
exports.VotesRepository = VotesRepository;
exports.VotesRepository = VotesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(vote_session_schema_js_1.VoteSession.name)),
    __param(1, (0, mongoose_1.InjectModel)(vote_response_schema_js_1.VoteResponse.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VotesRepository);
//# sourceMappingURL=votes.repository.js.map