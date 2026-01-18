import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MatchesService } from './matches.service.js';
import { CreateMatchDto } from './dto/create-match.dto.js';
import { UpdateMatchResultDto } from './dto/update-match-result.dto.js';
import { SplitTeamDto } from './dto/split-team.dto.js';
import {
  MatchResponseDto,
  MatchWithLineupsDto,
} from './dto/team-lineup.dto.js';
import { SwapPlayersDto, SwapPlayersResponseDto } from './dto/swap-players.dto.js';
import {
  AddPlayerToLineupDto,
  RemovePlayerFromLineupDto,
  MovePlayerDto,
} from './dto/lineup-management.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, Role } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { MatchStatus } from './schemas/match.schema.js';

@ApiTags('matches')
@Controller('matches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  // ==================== PUBLIC VIEW APIs ====================

  @Public()
  @Get()
  async findAllMatches(
    @Query('status') status?: MatchStatus,
  ): Promise<MatchResponseDto[]> {
    if (status) {
      return this.matchesService.findMatchesByStatus(status);
    }
    return this.matchesService.findAllMatches();
  }

  @Public()
  @Get(':id')
  async findMatch(@Param('id') id: string): Promise<MatchWithLineupsDto> {
    return this.matchesService.findMatchById(id);
  }

  @Public()
  @Get('user/:userId/history')
  async findMatchHistoryByUser(@Param('userId') userId: string): Promise<
    {
      id: string;
      matchDate: Date;
      location: string;
      status: string;
      team: 'A' | 'B';
      result?: { teamAScore: number; teamBScore: number };
      isWinner?: boolean;
    }[]
  > {
    return this.matchesService.findMatchHistoryByUser(userId);
  }

  // Preview team split without saving
  @Post('preview-split')
  @Roles(Role.ADMIN)
  async previewSplitTeams(
    @Body() splitDto: SplitTeamDto,
  ): Promise<{
    teamA: { id: string; name: string; skillLevel: number }[];
    teamB: { id: string; name: string; skillLevel: number }[];
    teamASkill: number;
    teamBSkill: number;
    skillDifference: number;
    balanceScore: number;
  }> {
    return this.matchesService.previewSplitTeams(splitDto);
  }

  // ==================== ADMIN ONLY APIs ====================

  @Post()
  @Roles(Role.ADMIN)
  async createMatch(
    @Body() createDto: CreateMatchDto,
  ): Promise<MatchResponseDto> {
    return this.matchesService.createMatch(createDto);
  }

  @Patch(':id/result')
  @Roles(Role.ADMIN)
  async updateResult(
    @Param('id') id: string,
    @Body() updateDto: UpdateMatchResultDto,
  ): Promise<MatchResponseDto> {
    return this.matchesService.updateMatchResult(id, updateDto);
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN)
  async cancelMatch(@Param('id') id: string): Promise<MatchResponseDto> {
    return this.matchesService.cancelMatch(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMatch(@Param('id') id: string): Promise<void> {
    return this.matchesService.deleteMatch(id);
  }

  @Post(':id/split-teams')
  @Roles(Role.ADMIN)
  async splitTeams(
    @Param('id') id: string,
    @Body() splitDto: SplitTeamDto,
  ): Promise<MatchWithLineupsDto> {
    return this.matchesService.splitTeams(id, splitDto);
  }

  @Post(':matchId/swap-players')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Swap players between teams',
    description: 'Admin swaps one player from Team A with one player from Team B. Only allowed before match has result.'
  })
  @ApiResponse({ status: 201, description: 'Players swapped successfully', type: SwapPlayersResponseDto })
  @ApiResponse({ status: 400, description: 'Cannot swap players after match has result' })
  @ApiResponse({ status: 404, description: 'Match not found or player not found in team' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async swapPlayers(
    @Param('matchId') matchId: string,
    @Body() dto: SwapPlayersDto,
  ): Promise<SwapPlayersResponseDto> {
    return this.matchesService.swapPlayers(matchId, dto.playerAId, dto.playerBId);
  }

  @Patch(':matchId/lineup/swap')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Swap players between teams (alternative endpoint)',
    description: 'Admin swaps two players between teams. Only allowed before match has result.'
  })
  @ApiResponse({ status: 200, description: 'Players swapped successfully' })
  @ApiResponse({ status: 400, description: 'Cannot swap players after match has result' })
  @ApiResponse({ status: 404, description: 'Match not found or player not found in team' })
  async swapPlayersAlt(
    @Param('matchId') matchId: string,
    @Body() dto: { player1Id: string; player2Id: string },
  ): Promise<SwapPlayersResponseDto> {
    return this.matchesService.swapPlayers(matchId, dto.player1Id, dto.player2Id);
  }

  @Post(':matchId/lineup/add-player')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Add player to team lineup',
    description: 'Admin adds a player to Team A or Team B. Only allowed before match has result.',
  })
  @ApiResponse({ status: 201, description: 'Player added successfully' })
  @ApiResponse({ status: 400, description: 'Cannot add player after match has result or player already in team' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async addPlayerToLineup(
    @Param('matchId') matchId: string,
    @Body() dto: AddPlayerToLineupDto,
  ): Promise<any> {
    return this.matchesService.addPlayerToLineup(matchId, dto.playerId, dto.team);
  }

  @Delete(':matchId/lineup/remove-player')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Remove player from lineup',
    description: 'Admin removes a player from their team. Only allowed before match has result.',
  })
  @ApiResponse({ status: 200, description: 'Player removed successfully' })
  @ApiResponse({ status: 400, description: 'Cannot remove player after match has result' })
  @ApiResponse({ status: 404, description: 'Match not found or player not found' })
  async removePlayerFromLineup(
    @Param('matchId') matchId: string,
    @Body() dto: RemovePlayerFromLineupDto,
  ): Promise<any> {
    return this.matchesService.removePlayerFromLineup(matchId, dto.playerId);
  }

  @Patch(':matchId/lineup/move-player')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Move player to another team',
    description: 'Admin moves a player from one team to another. Only allowed before match has result.',
  })
  @ApiResponse({ status: 200, description: 'Player moved successfully' })
  @ApiResponse({ status: 400, description: 'Cannot move player after match has result or player already in target team' })
  @ApiResponse({ status: 404, description: 'Match not found or player not found' })
  async movePlayer(
    @Param('matchId') matchId: string,
    @Body() dto: MovePlayerDto,
  ): Promise<any> {
    return this.matchesService.movePlayer(matchId, dto.playerId, dto.toTeam);
  }
}
