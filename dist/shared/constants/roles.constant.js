"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_MANAGER_ROLES = exports.FUND_MANAGER_ROLES = exports.MATCH_CREATOR_ROLES = exports.DEFAULT_ROLE = exports.ROLE_DESCRIPTIONS = exports.ROLE_DISPLAY_NAMES = exports.ROLE_HIERARCHY = exports.Role = void 0;
exports.hasRolePermission = hasRolePermission;
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["CAPTAIN"] = "captain";
    Role["PLAYER"] = "player";
})(Role || (exports.Role = Role = {}));
exports.ROLE_HIERARCHY = [Role.PLAYER, Role.CAPTAIN, Role.ADMIN];
function hasRolePermission(userRole, requiredRole) {
    const userLevel = exports.ROLE_HIERARCHY.indexOf(userRole);
    const requiredLevel = exports.ROLE_HIERARCHY.indexOf(requiredRole);
    return userLevel >= requiredLevel;
}
exports.ROLE_DISPLAY_NAMES = {
    [Role.ADMIN]: 'Quản trị viên',
    [Role.CAPTAIN]: 'Đội trưởng',
    [Role.PLAYER]: 'Cầu thủ',
};
exports.ROLE_DESCRIPTIONS = {
    [Role.ADMIN]: 'Có toàn quyền quản lý hệ thống',
    [Role.CAPTAIN]: 'Có thể tạo trận đấu, chia đội và quản lý vote',
    [Role.PLAYER]: 'Có thể tham gia vote và xem thông tin trận đấu',
};
exports.DEFAULT_ROLE = Role.PLAYER;
exports.MATCH_CREATOR_ROLES = [Role.ADMIN, Role.CAPTAIN];
exports.FUND_MANAGER_ROLES = [Role.ADMIN];
exports.USER_MANAGER_ROLES = [Role.ADMIN];
//# sourceMappingURL=roles.constant.js.map