import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'admin',
  CAPTAIN = 'captain',
  PLAYER = 'player',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
