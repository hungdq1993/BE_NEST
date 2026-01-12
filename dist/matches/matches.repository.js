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
exports.MatchesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const match_schema_js_1 = require("./schemas/match.schema.js");
const team_lineup_schema_js_1 = require("./schemas/team-lineup.schema.js");
let MatchesRepository = class MatchesRepository {
    matchModel;
    teamLineupModel;
    constructor(matchModel, teamLineupModel) {
        this.matchModel = matchModel;
        this.teamLineupModel = teamLineupModel;
    }
    async createMatch(createDto) {
        const match = new this.matchModel({
            ...createDto,
            matchDate: new Date(createDto.matchDate),
            voteSession: createDto.voteSessionId
                ? new mongoose_2.Types.ObjectId(createDto.voteSessionId)
                : undefined,
        });
        return match.save();
    }
    async findAllMatches() {
        return this.matchModel.find().sort({ matchDate: -1 }).exec();
    }
    async findMatchById(id) {
        return this.matchModel.findById(id).exec();
    }
    async findMatchesByStatus(status) {
        return this.matchModel.find({ status }).sort({ matchDate: -1 }).exec();
    }
    async updateMatchStatus(id, status) {
        return this.matchModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
    }
    async updateMatchResult(id, result, notes) {
        const update = { result, status: match_schema_js_1.MatchStatus.COMPLETED };
        if (notes)
            update.notes = notes;
        return this.matchModel.findByIdAndUpdate(id, update, { new: true }).exec();
    }
    async deleteMatch(id) {
        return this.matchModel.findByIdAndDelete(id).exec();
    }
    async createTeamLineup(matchId, team, playerIds, totalSkillLevel) {
        const lineup = new this.teamLineupModel({
            match: new mongoose_2.Types.ObjectId(matchId),
            team,
            players: playerIds.map((id) => new mongoose_2.Types.ObjectId(id)),
            totalSkillLevel,
        });
        return lineup.save();
    }
    async findLineupsByMatch(matchId) {
        return this.teamLineupModel
            .find({ match: new mongoose_2.Types.ObjectId(matchId) })
            .populate('players', 'name email skillLevel')
            .exec();
    }
    async findLineupByMatchAndTeam(matchId, team) {
        return this.teamLineupModel
            .findOne({ match: new mongoose_2.Types.ObjectId(matchId), team })
            .populate('players', 'name email skillLevel')
            .exec();
    }
    async deleteLineupsByMatch(matchId) {
        await this.teamLineupModel
            .deleteMany({ match: new mongoose_2.Types.ObjectId(matchId) })
            .exec();
    }
    async updateLineup(matchId, team, playerIds, totalSkillLevel) {
        return this.teamLineupModel
            .findOneAndUpdate({ match: new mongoose_2.Types.ObjectId(matchId), team }, {
            players: playerIds.map((id) => new mongoose_2.Types.ObjectId(id)),
            totalSkillLevel,
        }, { new: true, upsert: true })
            .populate('players', 'name email skillLevel')
            .exec();
    }
    async findMatchesByUser(userId) {
        const lineups = await this.teamLineupModel
            .find({ players: new mongoose_2.Types.ObjectId(userId) })
            .select('match team')
            .exec();
        const matchIds = lineups.map((l) => l.match);
        return this.matchModel
            .find({ _id: { $in: matchIds } })
            .sort({ matchDate: -1 })
            .exec();
    }
    async findMatchHistoryByUser(userId) {
        const lineups = await this.teamLineupModel
            .find({ players: new mongoose_2.Types.ObjectId(userId) })
            .populate('match')
            .exec();
        return lineups
            .filter((l) => l.match)
            .map((l) => ({
            match: l.match,
            team: l.team,
        }))
            .sort((a, b) => new Date(b.match.matchDate).getTime() -
            new Date(a.match.matchDate).getTime());
    }
};
exports.MatchesRepository = MatchesRepository;
exports.MatchesRepository = MatchesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(match_schema_js_1.Match.name)),
    __param(1, (0, mongoose_1.InjectModel)(team_lineup_schema_js_1.TeamLineup.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MatchesRepository);
//# sourceMappingURL=matches.repository.js.map