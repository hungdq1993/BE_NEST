/**
 * Team balancing utility functions for the football management system
 */

export interface Player {
  id: string;
  name: string;
  skillLevel: number;
}

export interface TeamSplit {
  teamA: Player[];
  teamB: Player[];
  teamASkill: number;
  teamBSkill: number;
  skillDifference: number;
  balanceScore: number;
}

/**
 * Calculate the total skill level of a team
 */
export function calculateTeamSkill(players: Player[]): number {
  return players.reduce((sum, player) => sum + player.skillLevel, 0);
}

/**
 * Calculate the average skill level of a team
 */
export function calculateAverageSkill(players: Player[]): number {
  if (players.length === 0) return 0;
  return calculateTeamSkill(players) / players.length;
}

/**
 * Calculate balance score (0-100, higher is better balanced)
 * 100 means perfectly balanced, 0 means completely unbalanced
 */
export function calculateBalanceScore(
  teamASkill: number,
  teamBSkill: number,
): number {
  const totalSkill = teamASkill + teamBSkill;
  if (totalSkill === 0) return 100;

  const difference = Math.abs(teamASkill - teamBSkill);
  const maxDifference = totalSkill; // Worst case: all skill on one team

  return Math.round((1 - difference / maxDifference) * 100);
}

/**
 * Split players into two balanced teams using greedy algorithm
 * Sorts players by skill and alternates assignment to minimize difference
 */
export function splitTeamsGreedy(players: Player[]): TeamSplit {
  if (players.length < 2) {
    throw new Error('Need at least 2 players to split teams');
  }

  // Sort players by skill level descending
  const sortedPlayers = [...players].sort(
    (a, b) => b.skillLevel - a.skillLevel,
  );

  const teamA: Player[] = [];
  const teamB: Player[] = [];
  let teamASkill = 0;
  let teamBSkill = 0;

  // Greedy assignment: assign each player to the team with lower total skill
  for (const player of sortedPlayers) {
    if (teamASkill <= teamBSkill) {
      teamA.push(player);
      teamASkill += player.skillLevel;
    } else {
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

/**
 * Check if a team split is valid (teams have reasonable size difference)
 */
export function isValidSplit(
  teamA: Player[],
  teamB: Player[],
  maxSizeDifference: number = 1,
): boolean {
  return Math.abs(teamA.length - teamB.length) <= maxSizeDifference;
}

/**
 * Get skill distribution statistics for a group of players
 */
export function getSkillDistribution(players: Player[]): {
  min: number;
  max: number;
  average: number;
  median: number;
  total: number;
} {
  if (players.length === 0) {
    return { min: 0, max: 0, average: 0, median: 0, total: 0 };
  }

  const skills = players.map((p) => p.skillLevel).sort((a, b) => a - b);
  const total = skills.reduce((sum, s) => sum + s, 0);
  const average = total / skills.length;

  const mid = Math.floor(skills.length / 2);
  const median =
    skills.length % 2 !== 0 ? skills[mid] : (skills[mid - 1] + skills[mid]) / 2;

  return {
    min: skills[0],
    max: skills[skills.length - 1],
    average: Math.round(average * 100) / 100,
    median,
    total,
  };
}

/**
 * Suggest optimal team size based on player count
 * For 7-a-side football, ideal is 7 players per team
 */
export function suggestTeamSize(
  totalPlayers: number,
  idealTeamSize: number = 7,
): { teamASize: number; teamBSize: number; substitutes: number } {
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
