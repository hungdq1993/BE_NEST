import { Role } from '../../common/decorators/roles.decorator.js';
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    name?: string;
    role?: Role;
    skillLevel?: number;
    avatar?: string;
    firebaseUid?: string;
    isActive?: boolean;
}
