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

  async findAllMatchesWithLineups(): Promise<MatchDocument[]> {
    return this.matchModel
      .find()
      .populate('teamA')
      .populate('teamB')
      .sort({ matchDate: -1 })
      .exec();
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

  async findAllLineups(): Promise<TeamLineupDocument[]> {
    return this.teamLineupModel
      .find()
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

  // Swap 2 players giữa team A và team B
  async swapPlayers(
    matchId: string,
    player1Id: string,
    player2Id: string,
  ): Promise<{
    teamA: TeamLineupDocument;
    teamB: TeamLineupDocument;
  }> {
    const [teamA, teamB] = await Promise.all([
      this.teamLineupModel
        .findOne({ match: new Types.ObjectId(matchId), team: 'A' })
        .populate('players', 'name email skillLevel')
        .exec(),
      this.teamLineupModel
        .findOne({ match: new Types.ObjectId(matchId), team: 'B' })
        .populate('players', 'name email skillLevel')
        .exec(),
    ]);

    if (!teamA || !teamB) {
      throw new Error('Team lineups not found');
    }

    // Tìm player1 trong cả 2 team
    const player1InTeamA = teamA.players.findIndex(
      (p) => (p as any)._id.toString() === player1Id,
    );
    const player1InTeamB = teamB.players.findIndex(
      (p) => (p as any)._id.toString() === player1Id,
    );

    // Tìm player2 trong cả 2 team
    const player2InTeamA = teamA.players.findIndex(
      (p) => (p as any)._id.toString() === player2Id,
    );
    const player2InTeamB = teamB.players.findIndex(
      (p) => (p as any)._id.toString() === player2Id,
    );

    // Kiểm tra cả 2 players đều tồn tại
    const player1Found = player1InTeamA !== -1 || player1InTeamB !== -1;
    const player2Found = player2InTeamA !== -1 || player2InTeamB !== -1;

    if (!player1Found) {
      throw new Error(`Player ${player1Id} not found in any team`);
    }

    if (!player2Found) {
      throw new Error(`Player ${player2Id} not found in any team`);
    }

    // Kiểm tra 2 players phải ở 2 team khác nhau
    const bothInTeamA = player1InTeamA !== -1 && player2InTeamA !== -1;
    const bothInTeamB = player1InTeamB !== -1 && player2InTeamB !== -1;

    if (bothInTeamA || bothInTeamB) {
      throw new Error('Both players are in the same team. Cannot swap.');
    }

    // Xác định player nào ở team nào và swap
    let player1Index: number, player2Index: number;
    let player1Team: TeamLineupDocument, player2Team: TeamLineupDocument;

    if (player1InTeamA !== -1) {
      player1Index = player1InTeamA;
      player1Team = teamA;
      player2Index = player2InTeamB;
      player2Team = teamB;
    } else {
      player1Index = player1InTeamB;
      player1Team = teamB;
      player2Index = player2InTeamA;
      player2Team = teamA;
    }

    // Swap players
    const tempPlayer = player1Team.players[player1Index];
    player1Team.players[player1Index] = player2Team.players[player2Index];
    player2Team.players[player2Index] = tempPlayer;

    // Save updated lineups
    const [updatedTeamA, updatedTeamB] = await Promise.all([
      this.teamLineupModel
        .findOneAndUpdate(
          { match: new Types.ObjectId(matchId), team: 'A' },
          { players: teamA.players },
          { new: true },
        )
        .populate('players', 'name email skillLevel')
        .exec(),
      this.teamLineupModel
        .findOneAndUpdate(
          { match: new Types.ObjectId(matchId), team: 'B' },
          { players: teamB.players },
          { new: true },
        )
        .populate('players', 'name email skillLevel')
        .exec(),
    ]);

    if (!updatedTeamA || !updatedTeamB) {
      throw new Error('Failed to update team lineups');
    }

    return {
      teamA: updatedTeamA,
      teamB: updatedTeamB,
    };
  }

  // Thêm player vào đội
  async addPlayerToLineup(
    matchId: string,
    playerId: string,
    team: 'A' | 'B',
  ): Promise<TeamLineupDocument> {
    const teamLineup = await this.teamLineupModel
      .findOne({ match: new Types.ObjectId(matchId), team })
      .exec();

    if (!teamLineup) {
      throw new Error(`Team ${team} lineup not found`);
    }

    // Kiểm tra player đã có trong đội chưa
    const playerExists = teamLineup.players.some(
      (p) => (p as Types.ObjectId).toString() === playerId,
    );

    if (playerExists) {
      throw new Error(`Player already in Team ${team}`);
    }

    // Thêm player vào đội
    teamLineup.players.push(new Types.ObjectId(playerId));

    const updated = await this.teamLineupModel
      .findOneAndUpdate(
        { match: new Types.ObjectId(matchId), team },
        { players: teamLineup.players },
        { new: true },
      )
      .populate('players', 'name email skillLevel')
      .exec();

    if (!updated) {
      throw new Error('Failed to update team lineup');
    }

    return updated;
  }

  // Xóa player khỏi đội
  async removePlayerFromLineup(
    matchId: string,
    playerId: string,
  ): Promise<{
    teamA: TeamLineupDocument | null;
    teamB: TeamLineupDocument | null;
    removedFrom: 'A' | 'B' | null;
  }> {
    const [teamA, teamB] = await Promise.all([
      this.teamLineupModel
        .findOne({ match: new Types.ObjectId(matchId), team: 'A' })
        .exec(),
      this.teamLineupModel
        .findOne({ match: new Types.ObjectId(matchId), team: 'B' })
        .exec(),
    ]);

    if (!teamA || !teamB) {
      throw new Error('Team lineups not found');
    }

    let removedFrom: 'A' | 'B' | null = null;
    let updatedTeamA: TeamLineupDocument | null = null;
    let updatedTeamB: TeamLineupDocument | null = null;

    // Tìm và xóa player từ team A
    const playerAIndex = teamA.players.findIndex(
      (p) => (p as Types.ObjectId).toString() === playerId,
    );

    if (playerAIndex !== -1) {
      teamA.players.splice(playerAIndex, 1);
      updatedTeamA = await this.teamLineupModel
        .findOneAndUpdate(
          { match: new Types.ObjectId(matchId), team: 'A' },
          { players: teamA.players },
          { new: true },
        )
        .populate('players', 'name email skillLevel')
        .exec();
      removedFrom = 'A';
    } else {
      // Tìm và xóa player từ team B
      const playerBIndex = teamB.players.findIndex(
        (p) => (p as Types.ObjectId).toString() === playerId,
      );

      if (playerBIndex !== -1) {
        teamB.players.splice(playerBIndex, 1);
        updatedTeamB = await this.teamLineupModel
          .findOneAndUpdate(
            { match: new Types.ObjectId(matchId), team: 'B' },
            { players: teamB.players },
            { new: true },
          )
          .populate('players', 'name email skillLevel')
          .exec();
        removedFrom = 'B';
      } else {
        throw new Error('Player not found in any team');
      }
    }

    return {
      teamA: updatedTeamA || teamA,
      teamB: updatedTeamB || teamB,
      removedFrom,
    };
  }

  // Di chuyển player sang đội khác
  async movePlayer(
    matchId: string,
    playerId: string,
    toTeam: 'A' | 'B',
  ): Promise<{
    teamA: TeamLineupDocument;
    teamB: TeamLineupDocument;
  }> {
    const [teamA, teamB] = await Promise.all([
      this.teamLineupModel
        .findOne({ match: new Types.ObjectId(matchId), team: 'A' })
        .exec(),
      this.teamLineupModel
        .findOne({ match: new Types.ObjectId(matchId), team: 'B' })
        .exec(),
    ]);

    if (!teamA || !teamB) {
      throw new Error('Team lineups not found');
    }

    const fromTeam = toTeam === 'A' ? 'B' : 'A';
    const sourceTeam = fromTeam === 'A' ? teamA : teamB;
    const targetTeam = toTeam === 'A' ? teamA : teamB;

    // Tìm player trong source team
    const playerIndex = sourceTeam.players.findIndex(
      (p) => (p as Types.ObjectId).toString() === playerId,
    );

    if (playerIndex === -1) {
      throw new Error(`Player not found in Team ${fromTeam}`);
    }

    // Kiểm tra player đã có trong target team chưa
    const playerExistsInTarget = targetTeam.players.some(
      (p) => (p as Types.ObjectId).toString() === playerId,
    );

    if (playerExistsInTarget) {
      throw new Error(`Player already in Team ${toTeam}`);
    }

    // Di chuyển player
    const player = sourceTeam.players[playerIndex];
    sourceTeam.players.splice(playerIndex, 1);
    targetTeam.players.push(player);

    // Save updated lineups
    const [updatedTeamA, updatedTeamB] = await Promise.all([
      this.teamLineupModel
        .findOneAndUpdate(
          { match: new Types.ObjectId(matchId), team: 'A' },
          { players: teamA.players },
          { new: true },
        )
        .populate('players', 'name email skillLevel')
        .exec(),
      this.teamLineupModel
        .findOneAndUpdate(
          { match: new Types.ObjectId(matchId), team: 'B' },
          { players: teamB.players },
          { new: true },
        )
        .populate('players', 'name email skillLevel')
        .exec(),
    ]);

    if (!updatedTeamA || !updatedTeamB) {
      throw new Error('Failed to update team lineups');
    }

    return {
      teamA: updatedTeamA,
      teamB: updatedTeamB,
    };
  }
}
