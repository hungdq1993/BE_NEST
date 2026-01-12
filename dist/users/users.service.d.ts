import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto, UserWithStatsResponseDto } from './dto/user-response.dto.js';
import { UserDocument } from './schemas/user.schema.js';
import { FundsRepository } from '../funds/funds.repository.js';
import { MatchesRepository } from '../matches/matches.repository.js';
interface CreateFromFirebaseDto {
    email: string;
    name: string;
    firebaseUid: string;
    avatar?: string;
}
export declare class UsersService {
    private readonly usersRepository;
    private readonly fundsRepository;
    private readonly matchesRepository;
    constructor(usersRepository: UsersRepository, fundsRepository: FundsRepository, matchesRepository: MatchesRepository);
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    findAll(): Promise<UserResponseDto[]>;
    findAllWithStats(): Promise<UserWithStatsResponseDto[]>;
    findById(id: string): Promise<UserResponseDto>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findByFirebaseUid(firebaseUid: string): Promise<UserDocument | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    delete(id: string): Promise<void>;
    validateUser(email: string, password: string): Promise<UserDocument | null>;
    linkFirebaseUid(userId: string, firebaseUid: string): Promise<UserDocument | null>;
    createFromFirebase(data: CreateFromFirebaseDto): Promise<UserResponseDto>;
    private toResponseDto;
}
export {};
