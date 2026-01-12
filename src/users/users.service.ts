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
    const users = await this.usersRepository.findAll();
    
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userId = user._id.toString();
        
        // Lấy thống kê tài chính
        const fundSummary = await this.fundsRepository.getUserFundSummary(userId);
        const totalDebt = 
          fundSummary.monthlyFees.pending + 
          fundSummary.penalties.pending + 
          fundSummary.matchPayments.pending;
        const totalPaid = 
          fundSummary.monthlyFees.paid + 
          fundSummary.penalties.paid + 
          fundSummary.matchPayments.paid;
        
        // Lấy lịch sử trận đấu
        const matchHistory = await this.matchesRepository.findMatchHistoryByUser(userId);
        
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
          matchesWon,
          matchesLost,
          matchesDraw,
          totalMatches: matchHistory.length,
        };
      })
    );
    
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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
