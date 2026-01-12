export declare enum Role {
    ADMIN = "admin",
    CAPTAIN = "captain",
    PLAYER = "player"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
