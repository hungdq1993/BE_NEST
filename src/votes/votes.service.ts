import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { VotesRepository } from './votes.repository.js';
import { CreateVoteSessionDto } from './dto/create-vote-session.dto.js';
import { SubmitVoteDto } from './dto/submit-vote.dto.js';
import {
  VoteStatsDto,
  VoteSessionResponseDto,
  VoteResponseDto,
  VoterDto,
} from './dto/vote-stats.dto.js';
import {
  VoteSessionDocument,
  VoteStatus,
} from './schemas/vote-session.schema.js';
import {
  VoteResponseDocument,
  VoteChoice,
} from './schemas/vote-response.schema.js';
import { UserDocument } from '@/users/schemas/user.schema.js';

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository) {}

  async createSession(
    createDto: CreateVoteSessionDto,
    userId: string,
  ): Promise<VoteSessionResponseDto> {
    const deadline = new Date(createDto.deadline);
    const matchDate = new Date(createDto.matchDate);

    if (deadline >= matchDate) {
      throw new BadRequestException('Deadline must be before match date');
    }

    const session = await this.votesRepository.createSession(createDto, userId);
    return this.toSessionResponseDto(session);
  }

  async findAllSessions(): Promise<VoteSessionResponseDto[]> {
    const sessions = await this.votesRepository.findAllSessions();
    return sessions.map((s) => this.toSessionResponseDto(s));
  }

  async findOpenSessions(): Promise<VoteSessionResponseDto[]> {
    const sessions = await this.votesRepository.findOpenSessions();
    return sessions.map((s) => this.toSessionResponseDto(s));
  }

  async findSessionById(id: string): Promise<VoteSessionResponseDto> {
    const session = await this.votesRepository.findSessionById(id);
    if (!session) {
      throw new NotFoundException('Vote session not found');
    }
    return this.toSessionResponseDto(session);
  }

  async closeSession(id: string): Promise<VoteSessionResponseDto> {
    const session = await this.votesRepository.updateSessionStatus(
      id,
      VoteStatus.CLOSED,
    );
    if (!session) {
      throw new NotFoundException('Vote session not found');
    }
    return this.toSessionResponseDto(session);
  }

  async cancelSession(id: string): Promise<VoteSessionResponseDto> {
    const session = await this.votesRepository.updateSessionStatus(
      id,
      VoteStatus.CANCELLED,
    );
    if (!session) {
      throw new NotFoundException('Vote session not found');
    }
    return this.toSessionResponseDto(session);
  }

  async deleteSession(id: string): Promise<void> {
    await this.votesRepository.deleteVotesBySession(id);
    const session = await this.votesRepository.deleteSession(id);
    if (!session) {
      throw new NotFoundException('Vote session not found');
    }
  }

  async submitVote(
    submitDto: SubmitVoteDto,
    userId: string,
  ): Promise<VoteResponseDto> {
    const session = await this.votesRepository.findSessionById(
      submitDto.sessionId,
    );
    if (!session) {
      throw new NotFoundException('Vote session not found');
    }

    if (session.status !== VoteStatus.OPEN) {
      throw new BadRequestException('Vote session is not open');
    }

    if (new Date() > session.deadline) {
      throw new BadRequestException('Vote deadline has passed');
    }

    const vote = await this.votesRepository.submitVote(
      submitDto.sessionId,
      userId,
      submitDto.choice,
      submitDto.note,
    );
    return this.toVoteResponseDto(vote);
  }

  async getSessionStats(sessionId: string): Promise<VoteStatsDto> {
    const session = await this.votesRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException('Vote session not found');
    }

    const votes = await this.votesRepository.findVotesBySession(sessionId);
    const voteCounts = await this.votesRepository.countVotesByChoice(sessionId);

    const countMap = new Map(voteCounts.map((v) => [v.choice, v.count]));

    const voters: VoterDto[] = votes.map((v) => ({
      userId: (v.user as Types.ObjectId).toString(),
      userName: (v.user as UserDocument).name,
      choice: v.choice,
      votedAt: v.createdAt,
    }));

    return {
      sessionId: session._id.toString(),
      matchDate: session.matchDate,
      deadline: session.deadline,
      status: session.status,
      totalVotes: votes.length,
      yesCount: countMap.get(VoteChoice.YES) || 0,
      noCount: countMap.get(VoteChoice.NO) || 0,
      maybeCount: countMap.get(VoteChoice.MAYBE) || 0,
      voters,
    };
  }

  async getUserVote(
    sessionId: string,
    userId: string,
  ): Promise<VoteResponseDto | null> {
    const vote = await this.votesRepository.findUserVote(sessionId, userId);
    return vote ? this.toVoteResponseDto(vote) : null;
  }

  private toSessionResponseDto(
    session: VoteSessionDocument,
  ): VoteSessionResponseDto {
    let createdById = 'unknown';

    if (session.createdBy != null) {
      if (typeof session.createdBy === 'object' && '_id' in session.createdBy) {
        createdById = String(session.createdBy._id);
      } else if (session.createdBy instanceof Types.ObjectId) {
        // ObjectId
        createdById = session.createdBy.toString();
      }
    }

    return {
      id: session._id.toString(),
      matchDate: session.matchDate,
      deadline: session.deadline,
      status: session.status,
      description: session.description,
      location: session.location,
      createdBy: createdById,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  private toVoteResponseDto(vote: VoteResponseDocument): VoteResponseDto {
    return {
      id: vote._id.toString(),
      sessionId: (vote.session as Types.ObjectId).toString(),
      userId: (vote.user as Types.ObjectId).toString(),
      choice: vote.choice,
      note: vote.note,
      createdAt: vote.createdAt,
      updatedAt: vote.updatedAt,
    };
  }
}
