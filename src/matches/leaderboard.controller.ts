import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service.js';
import {
  PlayerStatsDto,
  LeaderboardDto,
  HeadToHeadDto,
  TeamCompatibilityDto,
} from './dto/leaderboard.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('leaderboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  // ==================== PUBLIC APIs ====================

  @Public()
  @Get()
  async getLeaderboard(): Promise<LeaderboardDto> {
    return this.leaderboardService.getLeaderboard();
  }

  @Public()
  @Get('player/:userId')
  async getPlayerStats(@Param('userId') userId: string): Promise<PlayerStatsDto> {
    return this.leaderboardService.getPlayerStats(userId);
  }

  @Public()
  @Get('head-to-head')
  async getHeadToHead(
    @Query('player1') player1Id: string,
    @Query('player2') player2Id: string,
  ): Promise<HeadToHeadDto> {
    return this.leaderboardService.getHeadToHead(player1Id, player2Id);
  }

  @Public()
  @Get('compatibility')
  async getTeamCompatibility(
    @Query('player1') player1Id: string,
    @Query('player2') player2Id: string,
  ): Promise<TeamCompatibilityDto> {
    return this.leaderboardService.getTeamCompatibility(player1Id, player2Id);
  }
}
