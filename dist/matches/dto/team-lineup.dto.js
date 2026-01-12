"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchWithLineupsDto = exports.MatchResponseDto = exports.TeamLineupResponseDto = exports.PlayerDto = void 0;
class PlayerDto {
    id;
    name;
    skillLevel;
}
exports.PlayerDto = PlayerDto;
class TeamLineupResponseDto {
    id;
    matchId;
    team;
    players;
    totalSkillLevel;
    createdAt;
    updatedAt;
}
exports.TeamLineupResponseDto = TeamLineupResponseDto;
class MatchResponseDto {
    id;
    matchDate;
    location;
    status;
    voteSessionId;
    result;
    matchFee;
    notes;
    createdAt;
    updatedAt;
}
exports.MatchResponseDto = MatchResponseDto;
class MatchWithLineupsDto extends MatchResponseDto {
    teamA;
    teamB;
}
exports.MatchWithLineupsDto = MatchWithLineupsDto;
//# sourceMappingURL=team-lineup.dto.js.map