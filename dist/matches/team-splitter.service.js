"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSplitterService = void 0;
const common_1 = require("@nestjs/common");
let TeamSplitterService = class TeamSplitterService {
    splitTeams(players) {
        if (players.length < 2) {
            throw new Error('Need at least 2 players to split teams');
        }
        const sortedPlayers = [...players].sort((a, b) => b.skillLevel - a.skillLevel);
        const teamA = [];
        const teamB = [];
        let teamASkill = 0;
        let teamBSkill = 0;
        for (const player of sortedPlayers) {
            if (teamASkill <= teamBSkill) {
                teamA.push(player);
                teamASkill += player.skillLevel;
            }
            else {
                teamB.push(player);
                teamBSkill += player.skillLevel;
            }
        }
        return {
            teamA,
            teamB,
            teamASkill,
            teamBSkill,
            skillDifference: Math.abs(teamASkill - teamBSkill),
        };
    }
    calculateTeamSkill(players) {
        return players.reduce((sum, player) => sum + player.skillLevel, 0);
    }
};
exports.TeamSplitterService = TeamSplitterService;
exports.TeamSplitterService = TeamSplitterService = __decorate([
    (0, common_1.Injectable)()
], TeamSplitterService);
//# sourceMappingURL=team-splitter.service.js.map