import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto, UserWithStatsResponseDto } from './dto/user-response.dto.js';
import { UserDocument } from './schemas/user.schema.js';
import * as bcrypt from 'bcrypt';
import { FundsRepository } from '../funds/funds.repository.js';
import { MatchesRepository } from '../matches/matches.repository.js';

interface CreateFromFirebaseDto {
  email: string;
  name: string;
  firebaseUid: string;
  avatar?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => FundsRepository))
    private readonly fundsRepository: FundsRepository,
    @Inject(forwardRef(() => MatchesRepository))
    private readonly matchesRepository: MatchesRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.toResponseDto(user));
  }

  async findAllWithStats(): Promise<UserWithStatsResponseDto[]> {
    // Lấy tất cả data cần thiết một lần
    const [users, allMatches, allLineups] = await Promise.all([
      this.usersRepository.findAll(),
      this.matchesRepository.findAllMatches(),
      this.matchesRepository.findAllLineups(),
    ]);

    // Build lineup map by matchId
    const lineupsByMatch = new Map<string, { teamA?: any; teamB?: any }>();
    for (const lineup of allLineups) {
      const matchId = lineup.match.toString();
      if (!lineupsByMatch.has(matchId)) {
        lineupsByMatch.set(matchId, {});
      }
      const matchLineups = lineupsByMatch.get(matchId)!;
      if (lineup.team === 'A') {
        matchLineups.teamA = lineup;
      } else {
        matchLineups.teamB = lineup;
      }
    }

    // Build match history map cho tất cả users
    const userMatchHistory = new Map<string, Array<{ match: any; team: 'A' | 'B' }>>();
    
    for (const match of allMatches) {
      const matchId = match._id.toString();
      const lineups = lineupsByMatch.get(matchId);
      
      if (!lineups) continue;

      // Process team A players
      if (lineups.teamA?.players) {
        for (const player of lineups.teamA.players) {
          const userId = player._id ? player._id.toString() : player.toString();
          if (!userMatchHistory.has(userId)) {
            userMatchHistory.set(userId, []);
          }
          userMatchHistory.get(userId)!.push({ match, team: 'A' });
        }
      }

      // Process team B players
      if (lineups.teamB?.players) {
        for (const player of lineups.teamB.players) {
          const userId = player._id ? player._id.toString() : player.toString();
          if (!userMatchHistory.has(userId)) {
            userMatchHistory.set(userId, []);
          }
          userMatchHistory.get(userId)!.push({ match, team: 'B' });
        }
      }
    }

    // Lấy fund summary cho tất cả users song song
    const userFundSummaries = new Map<string, any>();
    await Promise.all(
      users.map(async (user) => {
        const userId = user._id.toString();
        const summary = await this.fundsRepository.getUserFundSummary(userId);
        userFundSummaries.set(userId, summary);
      })
    );

    // Build response cho từng user
    const usersWithStats = users.map((user) => {
      const userId = user._id.toString();
      const fundSummary = userFundSummaries.get(userId);
      const matchHistory = userMatchHistory.get(userId) || [];
      
      const totalDebt = fundSummary ? 
        fundSummary.monthlyFees.pending + 
        fundSummary.penalties.pending + 
        fundSummary.matchPayments.pending : 0;
      const totalPaid = fundSummary ?
        fundSummary.monthlyFees.paid + 
        fundSummary.penalties.paid + 
        fundSummary.matchPayments.paid : 0;
      
      let matchesWon = 0;
      let matchesLost = 0;
      let matchesDraw = 0;
      
      for (const { match, team } of matchHistory) {
        if (match.result) {
          const { teamAScore, teamBScore } = match.result;
          if (teamAScore === teamBScore) {
            matchesDraw++;
          } else if (
            (team === 'A' && teamAScore > teamBScore) ||
            (team === 'B' && teamBScore > teamAScore)
          ) {
            matchesWon++;
          } else {
            matchesLost++;
          }
        }
      }
      
      return {
        ...this.toResponseDto(user),
        totalDebt,
        totalPaid,
        unpaidMonthlyFees: fundSummary ? fundSummary.monthlyFees.pending : 0,
        unpaidMatchFees: fundSummary ? fundSummary.matchPayments.pending : 0,
        matchesWon,
        matchesLost,
        matchesDraw,
        totalMatches: matchHistory.length,
      };
    });
    
    return usersWithStats;
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserDocument | null> {
    return this.usersRepository.findByFirebaseUid(firebaseUid);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.usersRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toResponseDto(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.usersRepository.delete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  async bulkUpdateStudentStatus(
    userIds: string[],
    isStudent: boolean,
  ): Promise<{ updated: number; users: UserResponseDto[] }> {
    const users = await this.usersRepository.bulkUpdateStudentStatus(
      userIds,
      isStudent,
    );
    return {
      updated: users.length,
      users: users.map((user) => this.toResponseDto(user)),
    };
  }

  async bulkUpdateSkillLevel(
    userIds: string[],
    skillLevel: number,
  ): Promise<{ updated: number; users: UserResponseDto[] }> {
    const users = await this.usersRepository.bulkUpdateSkillLevel(
      userIds,
      skillLevel,
    );
    return {
      updated: users.length,
      users: users.map((user) => this.toResponseDto(user)),
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async linkFirebaseUid(
    userId: string,
    firebaseUid: string,
  ): Promise<UserDocument | null> {
    return this.usersRepository.update(userId, {
      firebaseUid: firebaseUid,
    });
  }

  async createFromFirebase(
    data: CreateFromFirebaseDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Generate random password for Firebase users (they won't use it)
    const randomPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = await this.usersRepository.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      firebaseUid: data.firebaseUid,
      avatar: data.avatar,
    } as CreateUserDto);

    return this.toResponseDto(user);
  }

  private toResponseDto(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      skillLevel: user.skillLevel,
      avatar: user.avatar,
      isActive: user.isActive,
      isStudent: user.isStudent || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
