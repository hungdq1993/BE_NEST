"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_js_1 = require("./users.repository.js");
const bcrypt = __importStar(require("bcrypt"));
const funds_repository_js_1 = require("../funds/funds.repository.js");
const matches_repository_js_1 = require("../matches/matches.repository.js");
let UsersService = class UsersService {
    usersRepository;
    fundsRepository;
    matchesRepository;
    constructor(usersRepository, fundsRepository, matchesRepository) {
        this.usersRepository = usersRepository;
        this.fundsRepository = fundsRepository;
        this.matchesRepository = matchesRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.toResponseDto(user);
    }
    async findAll() {
        const users = await this.usersRepository.findAll();
        return users.map((user) => this.toResponseDto(user));
    }
    async findAllWithStats() {
        const users = await this.usersRepository.findAll();
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const userId = user._id.toString();
            const fundSummary = await this.fundsRepository.getUserFundSummary(userId);
            const totalDebt = fundSummary.monthlyFees.pending +
                fundSummary.penalties.pending +
                fundSummary.matchPayments.pending;
            const totalPaid = fundSummary.monthlyFees.paid +
                fundSummary.penalties.paid +
                fundSummary.matchPayments.paid;
            const matchHistory = await this.matchesRepository.findMatchHistoryByUser(userId);
            let matchesWon = 0;
            let matchesLost = 0;
            let matchesDraw = 0;
            for (const { match, team } of matchHistory) {
                if (match.result) {
                    const { teamAScore, teamBScore } = match.result;
                    if (teamAScore === teamBScore) {
                        matchesDraw++;
                    }
                    else if ((team === 'A' && teamAScore > teamBScore) ||
                        (team === 'B' && teamBScore > teamAScore)) {
                        matchesWon++;
                    }
                    else {
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
        }));
        return usersWithStats;
    }
    async findById(id) {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toResponseDto(user);
    }
    async findByEmail(email) {
        return this.usersRepository.findByEmail(email);
    }
    async findByFirebaseUid(firebaseUid) {
        return this.usersRepository.findByFirebaseUid(firebaseUid);
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const user = await this.usersRepository.update(id, updateUserDto);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toResponseDto(user);
    }
    async delete(id) {
        const user = await this.usersRepository.delete(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
    async linkFirebaseUid(userId, firebaseUid) {
        return this.usersRepository.update(userId, {
            firebaseUid: firebaseUid,
        });
    }
    async createFromFirebase(data) {
        const existingUser = await this.usersRepository.findByEmail(data.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const randomPassword = Math.random().toString(36).slice(-12);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        const user = await this.usersRepository.create({
            email: data.email,
            name: data.name,
            password: hashedPassword,
            firebaseUid: data.firebaseUid,
            avatar: data.avatar,
        });
        return this.toResponseDto(user);
    }
    toResponseDto(user) {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => funds_repository_js_1.FundsRepository))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => matches_repository_js_1.MatchesRepository))),
    __metadata("design:paramtypes", [users_repository_js_1.UsersRepository,
        funds_repository_js_1.FundsRepository,
        matches_repository_js_1.MatchesRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map