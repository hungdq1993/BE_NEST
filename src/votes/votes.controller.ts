import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VotesService } from './votes.service.js';
import { CreateVoteSessionDto } from './dto/create-vote-session.dto.js';
import { SubmitVoteDto } from './dto/submit-vote.dto.js';
import {
  VoteStatsDto,
  VoteSessionResponseDto,
  VoteResponseDto,
} from './dto/vote-stats.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, Role } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('votes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  // ==================== PUBLIC VIEW APIs ====================

  @Public()
  @Get('sessions')
  async findAllSessions(): Promise<VoteSessionResponseDto[]> {
    return this.votesService.findAllSessions();
  }

  @Public()
  @Get('sessions/open')
  async findOpenSessions(): Promise<VoteSessionResponseDto[]> {
    return this.votesService.findOpenSessions();
  }

  @Public()
  @Get('sessions/:id')
  async findSession(@Param('id') id: string): Promise<VoteSessionResponseDto> {
    return this.votesService.findSessionById(id);
  }

  @Public()
  @Get('sessions/:id/stats')
  async getSessionStats(@Param('id') id: string): Promise<VoteStatsDto> {
    return this.votesService.getSessionStats(id);
  }

  // ==================== AUTHENTICATED USER APIs ====================

  @Post()
  async submitVote(
    @Body() submitDto: SubmitVoteDto,
    @CurrentUser() user: any,
  ): Promise<VoteResponseDto> {
    return this.votesService.submitVote(submitDto, user.sub);
  }

  @Get('sessions/:id/my-vote')
  async getMyVote(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<VoteResponseDto | null> {
    return this.votesService.getUserVote(id, user.sub);
  }

  // ==================== ADMIN ONLY APIs ====================

  @Post('sessions')
  @Roles(Role.ADMIN)
  async createSession(
    @Body() createDto: CreateVoteSessionDto,
    @CurrentUser() user: any,
  ): Promise<VoteSessionResponseDto> {
    return this.votesService.createSession(createDto, user.sub);
  }

  @Patch('sessions/:id/close')
  @Roles(Role.ADMIN)
  async closeSession(@Param('id') id: string): Promise<VoteSessionResponseDto> {
    return this.votesService.closeSession(id);
  }

  @Patch('sessions/:id/cancel')
  @Roles(Role.ADMIN)
  async cancelSession(
    @Param('id') id: string,
  ): Promise<VoteSessionResponseDto> {
    return this.votesService.cancelSession(id);
  }

  @Delete('sessions/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(@Param('id') id: string): Promise<void> {
    return this.votesService.deleteSession(id);
  }
}
