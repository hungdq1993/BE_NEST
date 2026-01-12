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
exports.MatchesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const matches_repository_js_1 = require("./matches.repository.js");
const team_splitter_service_js_1 = require("./team-splitter.service.js");
const match_schema_js_1 = require("./schemas/match.schema.js");
const users_service_js_1 = require("../users/users.service.js");
const funds_service_js_1 = require("../funds/funds.service.js");
let MatchesService = class MatchesService {
    matchesRepository;
    teamSplitterService;
    usersService;
    fundsService;
    constructor(matchesRepository, teamSplitterService, usersService, fundsService) {
        this.matchesRepository = matchesRepository;
        this.teamSplitterService = teamSplitterService;
        this.usersService = usersService;
        this.fundsService = fundsService;
    }
    async createMatch(createDto) {
        const match = await this.matchesRepository.createMatch(createDto);
        return this.toMatchResponseDto(match);
    }
    async findAllMatches() {
        const matches = await this.matchesRepository.findAllMatches();
        return matches.map((m) => this.toMatchResponseDto(m));
    }
    async findMatchById(id) {
        const match = await this.matchesRepository.findMatchById(id);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        const lineups = await this.matchesRepository.findLineupsByMatch(id);
        return this.toMatchWithLineupsDto(match, lineups);
    }
    async findMatchesByStatus(status) {
        const matches = await this.matchesRepository.findMatchesByStatus(status);
        return matches.map((m) => this.toMatchResponseDto(m));
    }
    async updateMatchResult(id, updateDto) {
        const match = await this.matchesRepository.updateMatchResult(id, updateDto.result, updateDto.notes);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        try {
            await this.fundsService.processLosingTeam(id);
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException ||
                err instanceof common_1.NotFoundException) {
                return this.toMatchResponseDto(match);
            }
            if (err instanceof Error) {
                console.error('Error processing losing team:', err.message);
            }
            else {
                console.error('Error processing losing team:', String(err));
            }
        }
        return this.toMatchResponseDto(match);
    }
    async cancelMatch(id) {
        const match = await this.matchesRepository.updateMatchStatus(id, match_schema_js_1.MatchStatus.CANCELLED);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        return this.toMatchResponseDto(match);
    }
    async deleteMatch(id) {
        await this.matchesRepository.deleteLineupsByMatch(id);
        const match = await this.matchesRepository.deleteMatch(id);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
    }
    async splitTeams(matchId, splitDto) {
        const match = await this.matchesRepository.findMatchById(matchId);
        if (!match) {
            throw new common_1.NotFoundException('Match not found');
        }
        if (match.status !== match_schema_js_1.MatchStatus.SCHEDULED) {
            throw new common_1.BadRequestException('Can only split teams for scheduled matches');
        }
        const players = [];
        for (const playerId of splitDto.playerIds) {
            const user = await this.usersService.findById(playerId);
            players.push({
                id: playerId,
                name: user.name,
                skillLevel: user.skillLevel,
            });
        }
        const result = this.teamSplitterService.splitTeams(players);
        await this.matchesRepository.deleteLineupsByMatch(matchId);
        await this.matchesRepository.createTeamLineup(matchId, 'A', result.teamA.map((p) => p.id), result.teamASkill);
        await this.matchesRepository.createTeamLineup(matchId, 'B', result.teamB.map((p) => p.id), result.teamBSkill);
        return this.findMatchById(matchId);
    }
    toMatchResponseDto(match) {
        const voteSessionId = match.voteSession instanceof mongoose_1.Types.ObjectId
            ? match.voteSession.toString()
            : typeof match.voteSession === 'object' &&
                match.voteSession !== null &&
                '_id' in match.voteSession
                ? match.voteSession._id.toString()
                : undefined;
        return {
            id: match._id.toString(),
            matchDate: match.matchDate,
            location: match.location,
            status: match.status,
            voteSessionId,
            result: match.result,
            matchFee: match.matchFee,
            notes: match.notes,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
        };
    }
    toTeamLineupResponseDto(lineup) {
        const players = lineup.players.map((p) => {
            if (typeof p === 'object' &&
                p !== null &&
                '_id' in p &&
                'name' in p &&
                'skillLevel' in p) {
                const player = p;
                return {
                    id: player._id.toString(),
                    name: player.name,
                    skillLevel: player.skillLevel,
                };
            }
            return {
                id: p instanceof mongoose_1.Types.ObjectId ? p.toString() : String(p),
                name: 'Unknown',
                skillLevel: 5,
            };
        });
        let matchId;
        if (lineup.match instanceof mongoose_1.Types.ObjectId) {
            matchId = lineup.match.toString();
        }
        else if (typeof lineup.match === 'object' &&
            lineup.match !== null &&
            '_id' in lineup.match) {
            matchId = lineup.match._id.toString();
        }
        else {
            matchId = 'unknown';
        }
        return {
            id: lineup._id.toString(),
            matchId,
            team: lineup.team,
            players,
            totalSkillLevel: lineup.totalSkillLevel,
            createdAt: lineup.createdAt,
            updatedAt: lineup.updatedAt,
        };
    }
    toMatchWithLineupsDto(match, lineups) {
        const dto = {
            ...this.toMatchResponseDto(match),
        };
        const teamA = lineups.find((l) => l.team === 'A');
        const teamB = lineups.find((l) => l.team === 'B');
        if (teamA)
            dto.teamA = this.toTeamLineupResponseDto(teamA);
        if (teamB)
            dto.teamB = this.toTeamLineupResponseDto(teamB);
        return dto;
    }
    async findMatchHistoryByUser(userId) {
        const history = await this.matchesRepository.findMatchHistoryByUser(userId);
        return history.map(({ match, team }) => {
            let isWinner;
            if (match.result) {
                const { teamAScore, teamBScore } = match.result;
                if (teamAScore !== teamBScore) {
                    isWinner =
                        (team === 'A' && teamAScore > teamBScore) ||
                            (team === 'B' && teamBScore > teamAScore);
                }
            }
            return {
                id: match._id.toString(),
                matchDate: match.matchDate,
                location: match.location,
                status: match.status,
                team,
                result: match.result,
                isWinner,
            };
        });
    }
};
exports.MatchesService = MatchesService;
exports.MatchesService = MatchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => funds_service_js_1.FundsService))),
    __metadata("design:paramtypes", [matches_repository_js_1.MatchesRepository,
        team_splitter_service_js_1.TeamSplitterService,
        users_service_js_1.UsersService,
        funds_service_js_1.FundsService])
], MatchesService);
//# sourceMappingURL=matches.service.js.map