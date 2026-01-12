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
import { MatchesService } from './matches.service.js';
import { CreateMatchDto } from './dto/create-match.dto.js';
import { UpdateMatchResultDto } from './dto/update-match-result.dto.js';
import { SplitTeamDto } from './dto/split-team.dto.js';
import {
  MatchResponseDto,
  MatchWithLineupsDto,
} from './dto/team-lineup.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, Role } from '../common/decorators/roles.decorator.js';
import { MatchStatus } from './schemas/match.schema.js';

@Controller('matches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.CAPTAIN)
  async createMatch(
    @Body() createDto: CreateMatchDto,
  ): Promise<MatchResponseDto> {
    return this.matchesService.createMatch(createDto);
  }

  @Get()
  async findAllMatches(
    @Query('status') status?: MatchStatus,
  ): Promise<MatchResponseDto[]> {
    if (status) {
      return this.matchesService.findMatchesByStatus(status);
    }
    return this.matchesService.findAllMatches();
  }

  @Get(':id')
  async findMatch(@Param('id') id: string): Promise<MatchWithLineupsDto> {
    return this.matchesService.findMatchById(id);
  }

  @Patch(':id/result')
  @Roles(Role.ADMIN, Role.CAPTAIN)
  async updateResult(
    @Param('id') id: string,
    @Body() updateDto: UpdateMatchResultDto,
  ): Promise<MatchResponseDto> {
    return this.matchesService.updateMatchResult(id, updateDto);
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN, Role.CAPTAIN)
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
  @Roles(Role.ADMIN, Role.CAPTAIN)
  async splitTeams(
    @Param('id') id: string,
    @Body() splitDto: SplitTeamDto,
  ): Promise<MatchWithLineupsDto> {
    return this.matchesService.splitTeams(id, splitDto);
  }

  @Get('user/:userId/history')
  @Roles(Role.ADMIN, Role.CAPTAIN)
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
}
