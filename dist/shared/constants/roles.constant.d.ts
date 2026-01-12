export declare enum Role {
    ADMIN = "admin",
    CAPTAIN = "captain",
    PLAYER = "player"
}
export declare const ROLE_HIERARCHY: Role[];
export declare function hasRolePermission(userRole: Role, requiredRole: Role): boolean;
export declare const ROLE_DISPLAY_NAMES: Record<Role, string>;
export declare const ROLE_DESCRIPTIONS: Record<Role, string>;
export declare const DEFAULT_ROLE = Role.PLAYER;
export declare const MATCH_CREATOR_ROLES: Role[];
export declare const FUND_MANAGER_ROLES: Role[];
export declare const USER_MANAGER_ROLES: Role[];
