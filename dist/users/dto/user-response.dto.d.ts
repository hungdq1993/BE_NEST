import { Role } from '../../common/decorators/roles.decorator.js';
export declare class UserResponseDto {
    id: string;
    email: string;
    name: string;
    role: Role;
    skillLevel: number;
    avatar?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserWithStatsResponseDto extends UserResponseDto {
    totalDebt: number;
    totalPaid: number;
    matchesWon: number;
    matchesLost: number;
    matchesDraw: number;
    totalMatches: number;
}
