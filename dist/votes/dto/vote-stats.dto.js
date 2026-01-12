"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteResponseDto = exports.VoteSessionResponseDto = exports.VoterDto = exports.VoteStatsDto = void 0;
class VoteStatsDto {
    sessionId;
    matchDate;
    deadline;
    status;
    totalVotes;
    yesCount;
    noCount;
    maybeCount;
    voters;
}
exports.VoteStatsDto = VoteStatsDto;
class VoterDto {
    userId;
    userName;
    choice;
    votedAt;
}
exports.VoterDto = VoterDto;
class VoteSessionResponseDto {
    id;
    matchDate;
    deadline;
    status;
    description;
    location;
    createdBy;
    createdAt;
    updatedAt;
}
exports.VoteSessionResponseDto = VoteSessionResponseDto;
class VoteResponseDto {
    id;
    sessionId;
    userId;
    choice;
    note;
    createdAt;
    updatedAt;
}
exports.VoteResponseDto = VoteResponseDto;
//# sourceMappingURL=vote-stats.dto.js.map