"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWithStatsResponseDto = exports.UserResponseDto = void 0;
class UserResponseDto {
    id;
    email;
    name;
    role;
    skillLevel;
    avatar;
    isActive;
    createdAt;
    updatedAt;
}
exports.UserResponseDto = UserResponseDto;
class UserWithStatsResponseDto extends UserResponseDto {
    totalDebt;
    totalPaid;
    matchesWon;
    matchesLost;
    matchesDraw;
    totalMatches;
}
exports.UserWithStatsResponseDto = UserWithStatsResponseDto;
//# sourceMappingURL=user-response.dto.js.map