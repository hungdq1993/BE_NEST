export class PlayerStatsDto {
  userId: string;
  userName: string;
  avatar?: string;
  skillLevel: number;

  // Match stats
  totalMatches: number;
  matchesWon: number;
  matchesLost: number;
  matchesDraw: number;
  winRate: number; // Percentage

  // Streaks
  currentStreak: number; // Positive = winning, Negative = losing
  longestWinStreak: number;
  longestLoseStreak: number;

  // Recent form (last 5 matches): W/L/D
  recentForm: ('W' | 'L' | 'D')[];

  // Financial
  totalPaid: number;
  totalDebt: number;
  paymentRate: number; // Percentage of on-time payments
}

export class LeaderboardDto {
  // By win rate (minimum 5 matches)
  byWinRate: LeaderboardEntryDto[];

  // By total wins
  byTotalWins: LeaderboardEntryDto[];

  // By current streak
  byCurrentStreak: LeaderboardEntryDto[];

  // Most active (by total matches)
  byActivity: LeaderboardEntryDto[];

  // Best payers (payment rate)
  byPaymentRate: LeaderboardEntryDto[];

  // MVP of the month (if voting enabled)
  monthlyMvp?: MonthlyMvpDto;

  generatedAt: Date;
}

export class LeaderboardEntryDto {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  value: number; // The metric value (win rate, total wins, etc.)
  secondaryValue?: number; // Additional info (e.g., total matches for win rate)
}

export class MonthlyMvpDto {
  month: number;
  year: number;
  userId: string;
  userName: string;
  avatar?: string;
  stats: {
    matchesPlayed: number;
    matchesWon: number;
    winRate: number;
  };
}

export class HeadToHeadDto {
  player1: {
    userId: string;
    userName: string;
    wins: number;
  };
  player2: {
    userId: string;
    userName: string;
    wins: number;
  };
  draws: number;
  totalMatches: number;
  lastMatch?: Date;
}

export class TeamCompatibilityDto {
  player1Id: string;
  player2Id: string;
  player1Name: string;
  player2Name: string;
  matchesTogether: number;
  winsTogether: number;
  winRateTogether: number;
}
