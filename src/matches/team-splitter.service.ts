import { Injectable } from '@nestjs/common';

export interface PlayerWithSkill {
  id: string;
  name: string;
  skillLevel: number;
}

export interface SplitResult {
  teamA: PlayerWithSkill[];
  teamB: PlayerWithSkill[];
  teamASkill: number;
  teamBSkill: number;
  skillDifference: number;
}

@Injectable()
export class TeamSplitterService {
  /**
   * Split players into two balanced teams based on skill level
   * Uses a greedy algorithm to minimize skill difference
   */
  splitTeams(players: PlayerWithSkill[]): SplitResult {
    if (players.length < 2) {
      throw new Error('Need at least 2 players to split teams');
    }

    // Sort players by skill level descending
    const sortedPlayers = [...players].sort(
      (a, b) => b.skillLevel - a.skillLevel,
    );

    const teamA: PlayerWithSkill[] = [];
    const teamB: PlayerWithSkill[] = [];
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

    return {
      teamA,
      teamB,
      teamASkill,
      teamBSkill,
      skillDifference: Math.abs(teamASkill - teamBSkill),
    };
  }

  /**
   * Calculate total skill level for a team
   */
  calculateTeamSkill(players: PlayerWithSkill[]): number {
    return players.reduce((sum, player) => sum + player.skillLevel, 0);
  }
}
