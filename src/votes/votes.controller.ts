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

@Controller('votes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post('sessions')
  @Roles(Role.ADMIN, Role.CAPTAIN)
  async createSession(
    @Body() createDto: CreateVoteSessionDto,
    @CurrentUser() user: any,
  ): Promise<VoteSessionResponseDto> {
    return this.votesService.createSession(createDto, user.sub);
  }

  @Get('sessions')
  async findAllSessions(): Promise<VoteSessionResponseDto[]> {
    return this.votesService.findAllSessions();
  }

  @Get('sessions/open')
  async findOpenSessions(): Promise<VoteSessionResponseDto[]> {
    return this.votesService.findOpenSessions();
  }

  @Get('sessions/:id')
  async findSession(@Param('id') id: string): Promise<VoteSessionResponseDto> {
    return this.votesService.findSessionById(id);
  }

  @Get('sessions/:id/stats')
  async getSessionStats(@Param('id') id: string): Promise<VoteStatsDto> {
    return this.votesService.getSessionStats(id);
  }

  @Patch('sessions/:id/close')
  @Roles(Role.ADMIN, Role.CAPTAIN)
  async closeSession(@Param('id') id: string): Promise<VoteSessionResponseDto> {
    return this.votesService.closeSession(id);
  }

  @Patch('sessions/:id/cancel')
  @Roles(Role.ADMIN, Role.CAPTAIN)
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
}
