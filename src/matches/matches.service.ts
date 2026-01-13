import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MatchesRepository } from './matches.repository.js';
import {
  TeamSplitterService,
  PlayerWithSkill,
} from './team-splitter.service.js';
import { CreateMatchDto } from './dto/create-match.dto.js';
import { UpdateMatchResultDto } from './dto/update-match-result.dto.js';
import { SplitTeamDto } from './dto/split-team.dto.js';
import {
  MatchResponseDto,
  MatchWithLineupsDto,
  TeamLineupResponseDto,
  PlayerDto,
} from './dto/team-lineup.dto.js';
import { MatchDocument, MatchStatus } from './schemas/match.schema.js';
import { TeamLineupDocument } from './schemas/team-lineup.schema.js';
import { UsersService } from '../users/users.service.js';
import { FundsService } from '../funds/funds.service.js';

@Injectable()
export class MatchesService {
  constructor(
    private readonly matchesRepository: MatchesRepository,
    private readonly teamSplitterService: TeamSplitterService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => FundsService))
    private readonly fundsService: FundsService,
  ) {}

  async createMatch(createDto: CreateMatchDto): Promise<MatchResponseDto> {
    const match = await this.matchesRepository.createMatch(createDto);
    return this.toMatchResponseDto(match);
  }

  async findAllMatches(): Promise<MatchResponseDto[]> {
    const matches = await this.matchesRepository.findAllMatches();
    return matches.map((m) => this.toMatchResponseDto(m));
  }

  async findMatchById(id: string): Promise<MatchWithLineupsDto> {
    const match = await this.matchesRepository.findMatchById(id);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const lineups = await this.matchesRepository.findLineupsByMatch(id);
    return this.toMatchWithLineupsDto(match, lineups);
  }

  async findMatchesByStatus(status: MatchStatus): Promise<MatchResponseDto[]> {
    const matches = await this.matchesRepository.findMatchesByStatus(status);
    return matches.map((m) => this.toMatchResponseDto(m));
  }

  async updateMatchResult(
    id: string,
    updateDto: UpdateMatchResultDto,
  ): Promise<MatchResponseDto> {
    const match = await this.matchesRepository.updateMatchResult(
      id,
      updateDto.result,
      updateDto.notes,
    );
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    // Tự động tạo match payments cho team thua (nếu chưa có)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.fundsService.processLosingTeam(id);
    } catch (err: unknown) {
      // Bỏ qua lỗi nếu trận hòa hoặc không tìm thấy match
      // Chỉ log để debug, không throw error vì update result vẫn thành công
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        // Trận hòa, đã có payments, hoặc không tìm thấy match - không cần xử lý
        return this.toMatchResponseDto(match);
      }
      // Unknown error - log nhưng không throw
      if (err instanceof Error) {
        console.error('Error processing losing team:', err.message);
      } else {
        console.error('Error processing losing team:', String(err));
      }
    }

    return this.toMatchResponseDto(match);
  }

  async cancelMatch(id: string): Promise<MatchResponseDto> {
    // Xoá tất cả match payments liên quan (vì trận bị huỷ thì không còn nợ)
    await this.fundsService.deleteMatchPaymentsByMatch(id);
    
    // Xoá tất cả penalties liên quan
    await this.fundsService.deletePenaltiesByMatch(id);
    
    const match = await this.matchesRepository.updateMatchStatus(
      id,
      MatchStatus.CANCELLED,
    );
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return this.toMatchResponseDto(match);
  }

  async deleteMatch(id: string): Promise<void> {
    // Xoá tất cả match payments liên quan đến trận đấu này
    await this.fundsService.deleteMatchPaymentsByMatch(id);
    
    // Xoá tất cả penalties liên quan đến trận đấu này
    await this.fundsService.deletePenaltiesByMatch(id);
    
    // Xoá lineups
    await this.matchesRepository.deleteLineupsByMatch(id);
    
    // Xoá match
    const match = await this.matchesRepository.deleteMatch(id);
    if (!match) {
      throw new NotFoundException('Match not found');
    }
  }

  async splitTeams(
    matchId: string,
    splitDto: SplitTeamDto,
  ): Promise<MatchWithLineupsDto> {
    const match = await this.matchesRepository.findMatchById(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.status !== MatchStatus.SCHEDULED) {
      throw new BadRequestException(
        'Can only split teams for scheduled matches',
      );
    }

    // Get player details
    const players: PlayerWithSkill[] = [];
    for (const playerId of splitDto.playerIds) {
      const user = await this.usersService.findById(playerId);
      players.push({
        id: playerId,
        name: user.name,
        skillLevel: user.skillLevel,
      });
    }

    // Use advanced splitting algorithm with options
    const result = await this.teamSplitterService.splitTeamsAdvanced(players, {
      useHistory: splitDto.useHistory ?? false,
      avoidFrequentTeammates: splitDto.avoidFrequentTeammates ?? false,
      balancePositions: splitDto.balancePositions ?? false,
      maxSkillDifference: splitDto.maxSkillDifference ?? 10,
    });

    // Save lineups
    await this.matchesRepository.deleteLineupsByMatch(matchId);
    await this.matchesRepository.createTeamLineup(
      matchId,
      'A',
      result.teamA.map((p) => p.id),
      result.teamASkill,
    );
    await this.matchesRepository.createTeamLineup(
      matchId,
      'B',
      result.teamB.map((p) => p.id),
      result.teamBSkill,
    );

    return this.findMatchById(matchId);
  }

  private toMatchResponseDto(match: MatchDocument): MatchResponseDto {
    const voteSessionId =
      match.voteSession instanceof Types.ObjectId
        ? match.voteSession.toString()
        : typeof match.voteSession === 'object' &&
            match.voteSession !== null &&
            '_id' in match.voteSession
          ? (match.voteSession as { _id: Types.ObjectId })._id.toString()
          : undefined;

    return {
      id: match._id.toString(),
      matchDate: match.matchDate,
      location: match.location,
      status: match.status,
      voteSessionId,
      result: match.result,
      matchFee: match.matchFee,
      notes: match.notes,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    };
  }

  private toTeamLineupResponseDto(
    lineup: TeamLineupDocument,
  ): TeamLineupResponseDto {
    type PopulatedPlayer = {
      _id: Types.ObjectId;
      name: string;
      skillLevel: number;
    };

    const players: PlayerDto[] = (lineup.players as unknown[]).map((p) => {
      if (
        typeof p === 'object' &&
        p !== null &&
        '_id' in p &&
        'name' in p &&
        'skillLevel' in p
      ) {
        const player = p as PopulatedPlayer;
        return {
          id: player._id.toString(),
          name: player.name,
          skillLevel: player.skillLevel,
        };
      }
      // Fallback nếu chưa populate
      return {
        id: p instanceof Types.ObjectId ? p.toString() : String(p),
        name: 'Unknown',
        skillLevel: 5,
      };
    });

    let matchId: string;
    if (lineup.match instanceof Types.ObjectId) {
      matchId = lineup.match.toString();
    } else if (
      typeof lineup.match === 'object' &&
      lineup.match !== null &&
      '_id' in lineup.match
    ) {
      matchId = (lineup.match as { _id: Types.ObjectId })._id.toString();
    } else {
      // Fallback - không nên xảy ra nếu data đúng
      matchId = 'unknown';
    }

    return {
      id: lineup._id.toString(),
      matchId,
      team: lineup.team,
      players,
      totalSkillLevel: lineup.totalSkillLevel,
      createdAt: lineup.createdAt,
      updatedAt: lineup.updatedAt,
    };
  }

  private toMatchWithLineupsDto(
    match: MatchDocument,
    lineups: TeamLineupDocument[],
  ): MatchWithLineupsDto {
    const dto: MatchWithLineupsDto = {
      ...this.toMatchResponseDto(match),
    };

    const teamA = lineups.find((l) => l.team === 'A');
    const teamB = lineups.find((l) => l.team === 'B');

    if (teamA) dto.teamA = this.toTeamLineupResponseDto(teamA);
    if (teamB) dto.teamB = this.toTeamLineupResponseDto(teamB);

    return dto;
  }

  // Lấy lịch sử trận đấu của user
  async findMatchHistoryByUser(userId: string): Promise<
    {
      id: string;
      matchDate: Date;
      location: string;
      status: MatchStatus;
      team: 'A' | 'B';
      result?: { teamAScore: number; teamBScore: number };
      isWinner?: boolean;
    }[]
  > {
    const history =
      await this.matchesRepository.findMatchHistoryByUser(userId);

    return history.map(({ match, team }) => {
      let isWinner: boolean | undefined;
      if (match.result) {
        const { teamAScore, teamBScore } = match.result;
        if (teamAScore !== teamBScore) {
          isWinner =
            (team === 'A' && teamAScore > teamBScore) ||
            (team === 'B' && teamBScore > teamAScore);
        }
      }

      return {
        id: match._id.toString(),
        matchDate: match.matchDate,
        location: match.location,
        status: match.status,
        team,
        result: match.result,
        isWinner,
      };
    });
  }

  // Preview team split without saving (for admin to review before confirming)
  async previewSplitTeams(splitDto: SplitTeamDto): Promise<{
    teamA: { id: string; name: string; skillLevel: number }[];
    teamB: { id: string; name: string; skillLevel: number }[];
    teamASkill: number;
    teamBSkill: number;
    skillDifference: number;
    balanceScore: number;
  }> {
    // Get player details
    const players: PlayerWithSkill[] = [];
    for (const playerId of splitDto.playerIds) {
      const user = await this.usersService.findById(playerId);
      players.push({
        id: playerId,
        name: user.name,
        skillLevel: user.skillLevel,
      });
    }

    // Use advanced splitting algorithm
    const result = await this.teamSplitterService.splitTeamsAdvanced(players, {
      useHistory: splitDto.useHistory ?? false,
      avoidFrequentTeammates: splitDto.avoidFrequentTeammates ?? false,
      balancePositions: splitDto.balancePositions ?? false,
      maxSkillDifference: splitDto.maxSkillDifference ?? 10,
    });

    return {
      teamA: result.teamA.map(p => ({ id: p.id, name: p.name, skillLevel: p.skillLevel })),
      teamB: result.teamB.map(p => ({ id: p.id, name: p.name, skillLevel: p.skillLevel })),
      teamASkill: result.teamASkill,
      teamBSkill: result.teamBSkill,
      skillDifference: result.skillDifference,
      balanceScore: result.balanceScore,
    };
  }
}
