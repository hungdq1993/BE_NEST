import { Injectable } from '@nestjs/common';
import { MatchesRepository } from './matches.repository.js';
import { UsersService } from '../users/users.service.js';
import { FundsRepository } from '../funds/funds.repository.js';
import {
  PlayerStatsDto,
  LeaderboardDto,
  LeaderboardEntryDto,
  HeadToHeadDto,
  TeamCompatibilityDto,
} from './dto/leaderboard.dto.js';
import { MatchStatus } from './schemas/match.schema.js';

interface MatchResult {
  odId: string;
  odDate: Date;
  team: 'A' | 'B';
  result: 'W' | 'L' | 'D';
  teamAScore: number;
  teamBScore: number;
}

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly matchesRepository: MatchesRepository,
    private readonly usersService: UsersService,
    private readonly fundsRepository: FundsRepository,
  ) {}

  async getPlayerStats(userId: string): Promise<PlayerStatsDto> {
    const user = await this.usersService.findById(userId);
    const matchHistory = await this.matchesRepository.findMatchHistoryByUser(userId);
    const fundSummary = await this.fundsRepository.getUserFundSummary(userId);

    // Process match results
    const results: MatchResult[] = [];
    let matchesWon = 0;
    let matchesLost = 0;
    let matchesDraw = 0;

    for (const { match, team } of matchHistory) {
      if (match.status !== MatchStatus.COMPLETED || !match.result) continue;

      const { teamAScore, teamBScore } = match.result;
      let result: 'W' | 'L' | 'D';

      if (teamAScore === teamBScore) {
        result = 'D';
        matchesDraw++;
      } else if (
        (team === 'A' && teamAScore > teamBScore) ||
        (team === 'B' && teamBScore > teamAScore)
      ) {
        result = 'W';
        matchesWon++;
      } else {
        result = 'L';
        matchesLost++;
      }

      results.push({
        odId: match._id.toString(),
        odDate: match.matchDate,
        team,
        result,
        teamAScore,
        teamBScore,
      });
    }

    // Sort by date descending
    results.sort((a, b) => b.odDate.getTime() - a.odDate.getTime());

    // Calculate streaks
    const { currentStreak, longestWinStreak, longestLoseStreak } = this.calculateStreaks(results);

    // Recent form (last 5)
    const recentForm = results.slice(0, 5).map(r => r.result);

    // Win rate
    const totalMatches = matchesWon + matchesLost + matchesDraw;
    const winRate = totalMatches > 0 ? Math.round((matchesWon / totalMatches) * 100) : 0;

    // Payment rate
    const totalPayments = fundSummary.monthlyFees.total + fundSummary.penalties.total + fundSummary.matchPayments.total;
    const paidPayments = fundSummary.monthlyFees.paid + fundSummary.penalties.paid + fundSummary.matchPayments.paid;
    const paymentRate = totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 100;

    return {
      userId: user.id,
      userName: user.name,
      avatar: user.avatar,
      skillLevel: user.skillLevel,
      totalMatches,
      matchesWon,
      matchesLost,
      matchesDraw,
      winRate,
      currentStreak,
      longestWinStreak,
      longestLoseStreak,
      recentForm,
      totalPaid: paidPayments,
      totalDebt: fundSummary.monthlyFees.pending + fundSummary.penalties.pending + fundSummary.matchPayments.pending,
      paymentRate,
    };
  }

  async getLeaderboard(): Promise<LeaderboardDto> {
    // Lấy tất cả data cần thiết một lần
    const [users, allMatches, allLineups] = await Promise.all([
      this.usersService.findAll(),
      this.matchesRepository.findAllMatches(),
      this.matchesRepository.findAllLineups(),
    ]);

    const activeUsers = users.filter(u => u.isActive);

    // Build lineup map by matchId
    const lineupsByMatch = new Map<string, { teamA?: any; teamB?: any }>();
    for (const lineup of allLineups) {
      const matchId = lineup.match.toString();
      if (!lineupsByMatch.has(matchId)) {
        lineupsByMatch.set(matchId, {});
      }
      const matchLineups = lineupsByMatch.get(matchId)!;
      if (lineup.team === 'A') {
        matchLineups.teamA = lineup;
      } else {
        matchLineups.teamB = lineup;
      }
    }

    // Build match history map cho tất cả users
    const userMatchHistory = new Map<string, MatchResult[]>();
    
    for (const match of allMatches) {
      if (match.status !== MatchStatus.COMPLETED || !match.result) continue;

      const { teamAScore, teamBScore } = match.result;
      const matchId = match._id.toString();
      const lineups = lineupsByMatch.get(matchId);
      
      if (!lineups) continue;

      // Process team A players
      if (lineups.teamA?.players) {
        for (const player of lineups.teamA.players) {
          const userId = player._id ? player._id.toString() : player.toString();
          if (!userMatchHistory.has(userId)) {
            userMatchHistory.set(userId, []);
          }

          let result: 'W' | 'L' | 'D';
          if (teamAScore === teamBScore) result = 'D';
          else if (teamAScore > teamBScore) result = 'W';
          else result = 'L';

          userMatchHistory.get(userId)!.push({
            odId: matchId,
            odDate: match.matchDate,
            team: 'A',
            result,
            teamAScore,
            teamBScore,
          });
        }
      }

      // Process team B players
      if (lineups.teamB?.players) {
        for (const player of lineups.teamB.players) {
          const userId = player._id ? player._id.toString() : player.toString();
          if (!userMatchHistory.has(userId)) {
            userMatchHistory.set(userId, []);
          }

          let result: 'W' | 'L' | 'D';
          if (teamAScore === teamBScore) result = 'D';
          else if (teamBScore > teamAScore) result = 'W';
          else result = 'L';

          userMatchHistory.get(userId)!.push({
            odId: matchId,
            odDate: match.matchDate,
            team: 'B',
            result,
            teamAScore,
            teamBScore,
          });
        }
      }
    }

    // Lấy fund summary cho tất cả users một lần
    const userFundSummaries = new Map<string, any>();
    await Promise.all(
      activeUsers.map(async (user) => {
        const summary = await this.fundsRepository.getUserFundSummary(user.id);
        userFundSummaries.set(user.id, summary);
      })
    );

    // Calculate stats cho tất cả users
    const allStats: PlayerStatsDto[] = activeUsers.map(user => {
      const results = userMatchHistory.get(user.id) || [];
      results.sort((a, b) => b.odDate.getTime() - a.odDate.getTime());

      let matchesWon = 0;
      let matchesLost = 0;
      let matchesDraw = 0;

      for (const r of results) {
        if (r.result === 'W') matchesWon++;
        else if (r.result === 'L') matchesLost++;
        else matchesDraw++;
      }

      const { currentStreak, longestWinStreak, longestLoseStreak } = this.calculateStreaks(results);
      const recentForm = results.slice(0, 5).map(r => r.result);
      const totalMatches = matchesWon + matchesLost + matchesDraw;
      const winRate = totalMatches > 0 ? Math.round((matchesWon / totalMatches) * 100) : 0;

      const fundSummary = userFundSummaries.get(user.id);
      const totalPayments = fundSummary ? 
        fundSummary.monthlyFees.total + fundSummary.penalties.total + fundSummary.matchPayments.total : 0;
      const paidPayments = fundSummary ?
        fundSummary.monthlyFees.paid + fundSummary.penalties.paid + fundSummary.matchPayments.paid : 0;
      const paymentRate = totalPayments > 0 ? Math.round((paidPayments / totalPayments) * 100) : 100;
      const totalDebt = fundSummary ?
        fundSummary.monthlyFees.pending + fundSummary.penalties.pending + fundSummary.matchPayments.pending : 0;

      return {
        userId: user.id,
        userName: user.name,
        avatar: user.avatar,
        skillLevel: user.skillLevel,
        totalMatches,
        matchesWon,
        matchesLost,
        matchesDraw,
        winRate,
        currentStreak,
        longestWinStreak,
        longestLoseStreak,
        recentForm,
        totalPaid: paidPayments,
        totalDebt,
        paymentRate,
      };
    });

    // By win rate (minimum 5 matches)
    const byWinRate = allStats
      .filter(s => s.totalMatches >= 5)
      .sort((a, b) => b.winRate - a.winRate || b.matchesWon - a.matchesWon)
      .slice(0, 10)
      .map((s, i) => this.toLeaderboardEntry(s, i + 1, s.winRate, s.totalMatches));

    // By total wins
    const byTotalWins = [...allStats]
      .sort((a, b) => b.matchesWon - a.matchesWon || b.winRate - a.winRate)
      .slice(0, 10)
      .map((s, i) => this.toLeaderboardEntry(s, i + 1, s.matchesWon, s.totalMatches));

    // By current streak (only positive streaks)
    const byCurrentStreak = [...allStats]
      .filter(s => s.currentStreak > 0)
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 10)
      .map((s, i) => this.toLeaderboardEntry(s, i + 1, s.currentStreak));

    // By activity
    const byActivity = [...allStats]
      .sort((a, b) => b.totalMatches - a.totalMatches)
      .slice(0, 10)
      .map((s, i) => this.toLeaderboardEntry(s, i + 1, s.totalMatches, s.matchesWon));

    // By payment rate (minimum some payments)
    const byPaymentRate = allStats
      .filter(s => s.totalPaid + s.totalDebt > 0)
      .sort((a, b) => b.paymentRate - a.paymentRate || b.totalPaid - a.totalPaid)
      .slice(0, 10)
      .map((s, i) => this.toLeaderboardEntry(s, i + 1, s.paymentRate, s.totalPaid));

    return {
      byWinRate,
      byTotalWins,
      byCurrentStreak,
      byActivity,
      byPaymentRate,
      generatedAt: new Date(),
    };
  }

  async getHeadToHead(player1Id: string, player2Id: string): Promise<HeadToHeadDto> {
    const [player1, player2] = await Promise.all([
      this.usersService.findById(player1Id),
      this.usersService.findById(player2Id),
    ]);

    const [history1, history2] = await Promise.all([
      this.matchesRepository.findMatchHistoryByUser(player1Id),
      this.matchesRepository.findMatchHistoryByUser(player2Id),
    ]);

    // Find matches where both players participated
    const player1MatchIds = new Map(history1.map(h => [h.match._id.toString(), h]));
    
    let player1Wins = 0;
    let player2Wins = 0;
    let draws = 0;
    let lastMatchDate: Date | undefined;

    for (const { match, team: team2 } of history2) {
      const matchId = match._id.toString();
      const player1Data = player1MatchIds.get(matchId);
      
      if (!player1Data || match.status !== MatchStatus.COMPLETED || !match.result) continue;

      const team1 = player1Data.team;
      
      // They were on opposite teams
      if (team1 !== team2) {
        const { teamAScore, teamBScore } = match.result;
        
        if (teamAScore === teamBScore) {
          draws++;
        } else if (
          (team1 === 'A' && teamAScore > teamBScore) ||
          (team1 === 'B' && teamBScore > teamAScore)
        ) {
          player1Wins++;
        } else {
          player2Wins++;
        }

        if (!lastMatchDate || match.matchDate > lastMatchDate) {
          lastMatchDate = match.matchDate;
        }
      }
    }

    return {
      player1: { userId: player1.id, userName: player1.name, wins: player1Wins },
      player2: { userId: player2.id, userName: player2.name, wins: player2Wins },
      draws,
      totalMatches: player1Wins + player2Wins + draws,
      lastMatch: lastMatchDate,
    };
  }

  async getTeamCompatibility(player1Id: string, player2Id: string): Promise<TeamCompatibilityDto> {
    const [player1, player2] = await Promise.all([
      this.usersService.findById(player1Id),
      this.usersService.findById(player2Id),
    ]);

    const [history1, history2] = await Promise.all([
      this.matchesRepository.findMatchHistoryByUser(player1Id),
      this.matchesRepository.findMatchHistoryByUser(player2Id),
    ]);

    const player1MatchIds = new Map(history1.map(h => [h.match._id.toString(), h]));
    
    let matchesTogether = 0;
    let winsTogether = 0;

    for (const { match, team: team2 } of history2) {
      const matchId = match._id.toString();
      const player1Data = player1MatchIds.get(matchId);
      
      if (!player1Data || match.status !== MatchStatus.COMPLETED || !match.result) continue;

      const team1 = player1Data.team;
      
      // They were on the same team
      if (team1 === team2) {
        matchesTogether++;
        const { teamAScore, teamBScore } = match.result;
        
        if (
          (team1 === 'A' && teamAScore > teamBScore) ||
          (team1 === 'B' && teamBScore > teamAScore)
        ) {
          winsTogether++;
        }
      }
    }

    return {
      player1Id,
      player2Id,
      player1Name: player1.name,
      player2Name: player2.name,
      matchesTogether,
      winsTogether,
      winRateTogether: matchesTogether > 0 ? Math.round((winsTogether / matchesTogether) * 100) : 0,
    };
  }

  // Get all pair compatibilities for smart team splitting
  async getAllPairCompatibilities(): Promise<Map<string, TeamCompatibilityDto>> {
    const users = await this.usersService.findAll();
    const activeUsers = users.filter(u => u.isActive);
    const compatibilities = new Map<string, TeamCompatibilityDto>();

    for (let i = 0; i < activeUsers.length; i++) {
      for (let j = i + 1; j < activeUsers.length; j++) {
        const compat = await this.getTeamCompatibility(activeUsers[i].id, activeUsers[j].id);
        const key = [activeUsers[i].id, activeUsers[j].id].sort().join('-');
        compatibilities.set(key, compat);
      }
    }

    return compatibilities;
  }

  private calculateStreaks(results: MatchResult[]): {
    currentStreak: number;
    longestWinStreak: number;
    longestLoseStreak: number;
  } {
    let currentStreak = 0;
    let longestWinStreak = 0;
    let longestLoseStreak = 0;
    let tempWinStreak = 0;
    let tempLoseStreak = 0;

    // Calculate current streak (from most recent)
    if (results.length > 0) {
      const firstResult = results[0].result;
      if (firstResult === 'W') {
        for (const r of results) {
          if (r.result === 'W') currentStreak++;
          else break;
        }
      } else if (firstResult === 'L') {
        for (const r of results) {
          if (r.result === 'L') currentStreak--;
          else break;
        }
      }
    }

    // Calculate longest streaks
    for (const r of results) {
      if (r.result === 'W') {
        tempWinStreak++;
        tempLoseStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, tempWinStreak);
      } else if (r.result === 'L') {
        tempLoseStreak++;
        tempWinStreak = 0;
        longestLoseStreak = Math.max(longestLoseStreak, tempLoseStreak);
      } else {
        tempWinStreak = 0;
        tempLoseStreak = 0;
      }
    }

    return { currentStreak, longestWinStreak, longestLoseStreak };
  }

  private toLeaderboardEntry(
    stats: PlayerStatsDto,
    rank: number,
    value: number,
    secondaryValue?: number,
  ): LeaderboardEntryDto {
    return {
      rank,
      userId: stats.userId,
      userName: stats.userName,
      avatar: stats.avatar,
      value,
      secondaryValue,
    };
  }
}
