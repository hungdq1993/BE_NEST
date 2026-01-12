"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTeamSkill = calculateTeamSkill;
exports.calculateAverageSkill = calculateAverageSkill;
exports.calculateBalanceScore = calculateBalanceScore;
exports.splitTeamsGreedy = splitTeamsGreedy;
exports.isValidSplit = isValidSplit;
exports.getSkillDistribution = getSkillDistribution;
exports.suggestTeamSize = suggestTeamSize;
function calculateTeamSkill(players) {
    return players.reduce((sum, player) => sum + player.skillLevel, 0);
}
function calculateAverageSkill(players) {
    if (players.length === 0)
        return 0;
    return calculateTeamSkill(players) / players.length;
}
function calculateBalanceScore(teamASkill, teamBSkill) {
    const totalSkill = teamASkill + teamBSkill;
    if (totalSkill === 0)
        return 100;
    const difference = Math.abs(teamASkill - teamBSkill);
    const maxDifference = totalSkill;
    return Math.round((1 - difference / maxDifference) * 100);
}
function splitTeamsGreedy(players) {
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
    const skillDifference = Math.abs(teamASkill - teamBSkill);
    const balanceScore = calculateBalanceScore(teamASkill, teamBSkill);
    return {
        teamA,
        teamB,
        teamASkill,
        teamBSkill,
        skillDifference,
        balanceScore,
    };
}
function isValidSplit(teamA, teamB, maxSizeDifference = 1) {
    return Math.abs(teamA.length - teamB.length) <= maxSizeDifference;
}
function getSkillDistribution(players) {
    if (players.length === 0) {
        return { min: 0, max: 0, average: 0, median: 0, total: 0 };
    }
    const skills = players.map((p) => p.skillLevel).sort((a, b) => a - b);
    const total = skills.reduce((sum, s) => sum + s, 0);
    const average = total / skills.length;
    const mid = Math.floor(skills.length / 2);
    const median = skills.length % 2 !== 0 ? skills[mid] : (skills[mid - 1] + skills[mid]) / 2;
    return {
        min: skills[0],
        max: skills[skills.length - 1],
        average: Math.round(average * 100) / 100,
        median,
        total,
    };
}
function suggestTeamSize(totalPlayers, idealTeamSize = 7) {
    const maxFieldPlayers = idealTeamSize * 2;
    if (totalPlayers <= maxFieldPlayers) {
        const teamASize = Math.ceil(totalPlayers / 2);
        const teamBSize = Math.floor(totalPlayers / 2);
        return { teamASize, teamBSize, substitutes: 0 };
    }
    return {
        teamASize: idealTeamSize,
        teamBSize: idealTeamSize,
        substitutes: totalPlayers - maxFieldPlayers,
    };
}
//# sourceMappingURL=team-balance.util.js.map