import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Match, MatchDocument, MatchStatus } from './schemas/match.schema.js';
import {
  TeamLineup,
  TeamLineupDocument,
} from './schemas/team-lineup.schema.js';
import { CreateMatchDto } from './dto/create-match.dto.js';

@Injectable()
export class MatchesRepository {
  constructor(
    @InjectModel(Match.name)
    private readonly matchModel: Model<MatchDocument>,
    @InjectModel(TeamLineup.name)
    private readonly teamLineupModel: Model<TeamLineupDocument>,
  ) {}

  // Match methods
  async createMatch(createDto: CreateMatchDto): Promise<MatchDocument> {
    const match = new this.matchModel({
      ...createDto,
      matchDate: new Date(createDto.matchDate),
      voteSession: createDto.voteSessionId
        ? new Types.ObjectId(createDto.voteSessionId)
        : undefined,
    });
    return match.save();
  }

  async findAllMatches(): Promise<MatchDocument[]> {
    return this.matchModel.find().sort({ matchDate: -1 }).exec();
  }

  async findMatchById(id: string): Promise<MatchDocument | null> {
    return this.matchModel.findById(id).exec();
  }

  async findMatchesByStatus(status: MatchStatus): Promise<MatchDocument[]> {
    return this.matchModel.find({ status }).sort({ matchDate: -1 }).exec();
  }

  async updateMatchStatus(
    id: string,
    status: MatchStatus,
  ): Promise<MatchDocument | null> {
    return this.matchModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async updateMatchResult(
    id: string,
    result: { teamAScore: number; teamBScore: number },
    notes?: string,
  ): Promise<MatchDocument | null> {
    const update: any = { result, status: MatchStatus.COMPLETED };
    if (notes) update.notes = notes;
    return this.matchModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteMatch(id: string): Promise<MatchDocument | null> {
    return this.matchModel.findByIdAndDelete(id).exec();
  }

  // TeamLineup methods
  async createTeamLineup(
    matchId: string,
    team: 'A' | 'B',
    playerIds: string[],
    totalSkillLevel: number,
  ): Promise<TeamLineupDocument> {
    const lineup = new this.teamLineupModel({
      match: new Types.ObjectId(matchId),
      team,
      players: playerIds.map((id) => new Types.ObjectId(id)),
      totalSkillLevel,
    });
    return lineup.save();
  }

  async findLineupsByMatch(matchId: string): Promise<TeamLineupDocument[]> {
    return this.teamLineupModel
      .find({ match: new Types.ObjectId(matchId) })
      .populate('players', 'name email skillLevel')
      .exec();
  }

  async findLineupByMatchAndTeam(
    matchId: string,
    team: 'A' | 'B',
  ): Promise<TeamLineupDocument | null> {
    return this.teamLineupModel
      .findOne({ match: new Types.ObjectId(matchId), team })
      .populate('players', 'name email skillLevel')
      .exec();
  }

  async deleteLineupsByMatch(matchId: string): Promise<void> {
    await this.teamLineupModel
      .deleteMany({ match: new Types.ObjectId(matchId) })
      .exec();
  }

  async updateLineup(
    matchId: string,
    team: 'A' | 'B',
    playerIds: string[],
    totalSkillLevel: number,
  ): Promise<TeamLineupDocument | null> {
    return this.teamLineupModel
      .findOneAndUpdate(
        { match: new Types.ObjectId(matchId), team },
        {
          players: playerIds.map((id) => new Types.ObjectId(id)),
          totalSkillLevel,
        },
        { new: true, upsert: true },
      )
      .populate('players', 'name email skillLevel')
      .exec();
  }

  // Lấy lịch sử trận đấu của user
  async findMatchesByUser(userId: string): Promise<MatchDocument[]> {
    // Tìm tất cả lineup có user này
    const lineups = await this.teamLineupModel
      .find({ players: new Types.ObjectId(userId) })
      .select('match team')
      .exec();

    const matchIds = lineups.map((l) => l.match as Types.ObjectId);

    // Lấy thông tin các trận đấu
    return this.matchModel
      .find({ _id: { $in: matchIds } })
      .sort({ matchDate: -1 })
      .exec();
  }

  // Lấy lịch sử trận đấu của user với thông tin team
  async findMatchHistoryByUser(
    userId: string,
  ): Promise<{ match: MatchDocument; team: 'A' | 'B' }[]> {
    const lineups = await this.teamLineupModel
      .find({ players: new Types.ObjectId(userId) })
      .populate('match')
      .exec();

    return lineups
      .filter((l) => l.match)
      .map((l) => ({
        match: l.match as unknown as MatchDocument,
        team: l.team,
      }))
      .sort(
        (a, b) =>
          new Date(b.match.matchDate).getTime() -
          new Date(a.match.matchDate).getTime(),
      );
  }
}
