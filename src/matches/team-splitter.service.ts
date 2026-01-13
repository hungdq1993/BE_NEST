import { Injectable } from '@nestjs/common';
import { MatchesRepository } from './matches.repository.js';
import { MatchStatus } from './schemas/match.schema.js';

export interface PlayerWithSkill {
  id: string;
  name: string;
  skillLevel: number;
  position?: 'GK' | 'DEF' | 'MID' | 'FWD'; // Optional position
}

export interface SplitResult {
  teamA: PlayerWithSkill[];
  teamB: PlayerWithSkill[];
  teamASkill: number;
  teamBSkill: number;
  skillDifference: number;
  balanceScore: number; // Overall balance score (lower is better)
}

export interface SplitOptions {
  // Có sử dụng lịch sử đối đầu không
  useHistory?: boolean;
  // Tránh để 2 người hay chơi cùng nhau vào 1 team
  avoidFrequentTeammates?: boolean;
  // Cân bằng theo vị trí
  balancePositions?: boolean;
  // Ngưỡng chênh lệch skill chấp nhận được (default: 3)
  maxSkillDifference?: number;
}

interface PlayerPairHistory {
  matchesTogether: number;
  winsTogether: number;
  matchesAgainst: number;
  winsAgainst: number;
}

@Injectable()
export class TeamSplitterService {
  constructor(private readonly matchesRepository: MatchesRepository) {}

  /**
   * Split players into two balanced teams with RANDOMIZATION
   * Each call produces different but balanced results
   */
  async splitTeamsAdvanced(
    players: PlayerWithSkill[],
    options: SplitOptions = {},
  ): Promise<SplitResult> {
    const {
      useHistory = false, // Tắt mặc định để tăng tốc và random hơn
      avoidFrequentTeammates = false,
      balancePositions = false,
      maxSkillDifference = 10, // Tăng lên để có nhiều options hơn
    } = options;

    if (players.length < 2) {
      throw new Error('Need at least 2 players to split teams');
    }

    // Get pair history if needed
    let pairHistory: Map<string, PlayerPairHistory> | null = null;
    if (useHistory || avoidFrequentTeammates) {
      pairHistory = await this.buildPairHistory(players.map(p => p.id));
    }

    // Generate multiple RANDOM valid splits
    const validSplits: SplitResult[] = [];
    const maxAttempts = 200; // Tăng số lần thử

    for (let i = 0; i < maxAttempts; i++) {
      const split = this.generateRandomSplit(players);
      const skillDiff = Math.abs(split.teamASkill - split.teamBSkill);

      // Only accept splits within acceptable skill difference
      if (skillDiff <= maxSkillDifference) {
        if (pairHistory) {
          const score = this.evaluateTeamSplit(
            split.teamA,
            split.teamB,
            pairHistory,
            { avoidFrequentTeammates, balancePositions },
          );
          validSplits.push({ ...split, balanceScore: score });
        } else {
          validSplits.push({ ...split, balanceScore: skillDiff });
        }
      }
    }

    // If no valid splits found, just return a random split (ignore skill difference)
    if (validSplits.length === 0) {
      const randomSplit = this.generateRandomSplit(players);
      return { ...randomSplit, balanceScore: randomSplit.skillDifference };
    }

    // PURE RANDOM: Just pick any valid split randomly
    const randomIndex = Math.floor(Math.random() * validSplits.length);
    return validSplits[randomIndex];
  }

  /**
   * Generate a random team split
   */
  private generateRandomSplit(players: PlayerWithSkill[]): SplitResult {
    const shuffled = this.shuffleArray([...players]);
    const halfSize = Math.ceil(players.length / 2);

    const teamA = shuffled.slice(0, halfSize);
    const teamB = shuffled.slice(halfSize);

    const teamASkill = this.calculateTeamSkill(teamA);
    const teamBSkill = this.calculateTeamSkill(teamB);

    return {
      teamA,
      teamB,
      teamASkill,
      teamBSkill,
      skillDifference: Math.abs(teamASkill - teamBSkill),
      balanceScore: 0,
    };
  }

  /**
   * Original greedy algorithm (fallback)
   */
  splitTeams(players: PlayerWithSkill[]): SplitResult {
    if (players.length < 2) {
      throw new Error('Need at least 2 players to split teams');
    }

    // Shuffle first to add randomness even in greedy
    const shuffledPlayers = this.shuffleArray([...players]);
    const sortedPlayers = shuffledPlayers.sort(
      (a, b) => b.skillLevel - a.skillLevel,
    );

    const teamA: PlayerWithSkill[] = [];
    const teamB: PlayerWithSkill[] = [];
    let teamASkill = 0;
    let teamBSkill = 0;

    for (const player of sortedPlayers) {
      // Add some randomness when skills are close
      const shouldGoToA = teamASkill < teamBSkill || 
        (teamASkill === teamBSkill && Math.random() > 0.5);

      if (shouldGoToA) {
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
      balanceScore: Math.abs(teamASkill - teamBSkill),
    };
  }

  calculateTeamSkill(players: PlayerWithSkill[]): number {
    return players.reduce((sum, player) => sum + player.skillLevel, 0);
  }

  /**
   * Build history of player pairs from past matches
   */
  private async buildPairHistory(
    playerIds: string[],
  ): Promise<Map<string, PlayerPairHistory>> {
    const history = new Map<string, PlayerPairHistory>();

    // Initialize all pairs
    for (let i = 0; i < playerIds.length; i++) {
      for (let j = i + 1; j < playerIds.length; j++) {
        const key = this.getPairKey(playerIds[i], playerIds[j]);
        history.set(key, {
          matchesTogether: 0,
          winsTogether: 0,
          matchesAgainst: 0,
          winsAgainst: 0,
        });
      }
    }

    // Get match history for all players
    const allHistories = await Promise.all(
      playerIds.map(id => this.matchesRepository.findMatchHistoryByUser(id)),
    );

    // Build a map of matchId -> { playerId -> team }
    const matchPlayerTeams = new Map<string, Map<string, 'A' | 'B'>>();
    const matchResults = new Map<string, { teamAScore: number; teamBScore: number }>();

    for (let i = 0; i < playerIds.length; i++) {
      const playerId = playerIds[i];
      for (const { match, team } of allHistories[i]) {
        if (match.status !== MatchStatus.COMPLETED || !match.result) continue;

        const matchId = match._id.toString();
        if (!matchPlayerTeams.has(matchId)) {
          matchPlayerTeams.set(matchId, new Map());
          matchResults.set(matchId, match.result);
        }
        matchPlayerTeams.get(matchId)!.set(playerId, team);
      }
    }

    // Analyze pairs
    for (const [matchId, playerTeamMap] of matchPlayerTeams) {
      const result = matchResults.get(matchId)!;
      const playersInMatch = Array.from(playerTeamMap.entries());

      for (let i = 0; i < playersInMatch.length; i++) {
        for (let j = i + 1; j < playersInMatch.length; j++) {
          const [player1Id, team1] = playersInMatch[i];
          const [player2Id, team2] = playersInMatch[j];

          if (!playerIds.includes(player1Id) || !playerIds.includes(player2Id)) continue;

          const key = this.getPairKey(player1Id, player2Id);
          const pairData = history.get(key);
          if (!pairData) continue;

          const teamAWon = result.teamAScore > result.teamBScore;
          const teamBWon = result.teamBScore > result.teamAScore;

          if (team1 === team2) {
            pairData.matchesTogether++;
            if ((team1 === 'A' && teamAWon) || (team1 === 'B' && teamBWon)) {
              pairData.winsTogether++;
            }
          } else {
            pairData.matchesAgainst++;
            const player1IsFirst = player1Id < player2Id;
            const player1Team = player1IsFirst ? team1 : team2;
            if ((player1Team === 'A' && teamAWon) || (player1Team === 'B' && teamBWon)) {
              pairData.winsAgainst++;
            }
          }
        }
      }
    }

    return history;
  }

  /**
   * Evaluate how good a team split is (lower score = better)
   */
  private evaluateTeamSplit(
    teamA: PlayerWithSkill[],
    teamB: PlayerWithSkill[],
    pairHistory: Map<string, PlayerPairHistory> | null,
    options: { avoidFrequentTeammates: boolean; balancePositions: boolean },
  ): number {
    let score = 0;

    // 1. Skill difference (weight: 10)
    const skillA = this.calculateTeamSkill(teamA);
    const skillB = this.calculateTeamSkill(teamB);
    const skillDiff = Math.abs(skillA - skillB);
    score += skillDiff * 10;

    // 2. Teammate frequency penalty (weight: 3) - reduced weight for more variety
    if (options.avoidFrequentTeammates && pairHistory) {
      const teamAPenalty = this.calculateTeammatePenalty(teamA, pairHistory);
      const teamBPenalty = this.calculateTeammatePenalty(teamB, pairHistory);
      score += (teamAPenalty + teamBPenalty) * 3;
    }

    // 3. Position balance (weight: 2)
    if (options.balancePositions) {
      const positionImbalance = this.calculatePositionImbalance(teamA, teamB);
      score += positionImbalance * 2;
    }

    // 4. Team size balance (weight: 20)
    const sizeDiff = Math.abs(teamA.length - teamB.length);
    score += sizeDiff * 20;

    return score;
  }

  /**
   * Calculate penalty for frequent teammates
   */
  private calculateTeammatePenalty(
    team: PlayerWithSkill[],
    pairHistory: Map<string, PlayerPairHistory>,
  ): number {
    let penalty = 0;

    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        const key = this.getPairKey(team[i].id, team[j].id);
        const history = pairHistory.get(key);
        if (history && history.matchesTogether > 3) {
          penalty += history.matchesTogether - 3;
        }
      }
    }

    return penalty;
  }

  /**
   * Calculate position imbalance between teams
   */
  private calculatePositionImbalance(
    teamA: PlayerWithSkill[],
    teamB: PlayerWithSkill[],
  ): number {
    const countPositions = (team: PlayerWithSkill[]) => {
      const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
      for (const p of team) {
        if (p.position) counts[p.position]++;
      }
      return counts;
    };

    const posA = countPositions(teamA);
    const posB = countPositions(teamB);

    let imbalance = 0;
    for (const pos of ['GK', 'DEF', 'MID', 'FWD'] as const) {
      imbalance += Math.abs(posA[pos] - posB[pos]);
    }

    return imbalance;
  }

  private getPairKey(id1: string, id2: string): string {
    return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
  }

  /**
   * Fisher-Yates shuffle - truly random
   */
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
