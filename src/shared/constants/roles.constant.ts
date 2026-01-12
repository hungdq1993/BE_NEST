/**
 * Role constants for the football management system
 */

export enum Role {
  ADMIN = 'admin',
  CAPTAIN = 'captain',
  PLAYER = 'player',
}

/**
 * Role hierarchy - higher index means more permissions
 */
export const ROLE_HIERARCHY: Role[] = [Role.PLAYER, Role.CAPTAIN, Role.ADMIN];

/**
 * Check if a role has at least the required permission level
 */
export function hasRolePermission(userRole: Role, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}

/**
 * Role display names in Vietnamese
 */
export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  [Role.ADMIN]: 'Quản trị viên',
  [Role.CAPTAIN]: 'Đội trưởng',
  [Role.PLAYER]: 'Cầu thủ',
};

/**
 * Role descriptions
 */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [Role.ADMIN]: 'Có toàn quyền quản lý hệ thống',
  [Role.CAPTAIN]: 'Có thể tạo trận đấu, chia đội và quản lý vote',
  [Role.PLAYER]: 'Có thể tham gia vote và xem thông tin trận đấu',
};

/**
 * Default role for new users
 */
export const DEFAULT_ROLE = Role.PLAYER;

/**
 * Roles that can create matches
 */
export const MATCH_CREATOR_ROLES: Role[] = [Role.ADMIN, Role.CAPTAIN];

/**
 * Roles that can manage funds
 */
export const FUND_MANAGER_ROLES: Role[] = [Role.ADMIN];

/**
 * Roles that can manage users
 */
export const USER_MANAGER_ROLES: Role[] = [Role.ADMIN];
