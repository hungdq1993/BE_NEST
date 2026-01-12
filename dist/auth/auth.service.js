"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const firebase_auth_service_js_1 = require("./providers/firebase-auth.service.js");
const users_service_js_1 = require("../users/users.service.js");
let AuthService = class AuthService {
    jwtService;
    configService;
    firebaseAuthService;
    usersService;
    constructor(jwtService, configService, firebaseAuthService, usersService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.firebaseAuthService = firebaseAuthService;
        this.usersService = usersService;
    }
    async validateUser(email, password) {
        return this.usersService.validateUser(email, password);
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens({
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
            },
            tokens,
        };
    }
    async register(registerDto) {
        const user = await this.usersService.create({
            email: registerDto.email,
            password: registerDto.password,
            name: registerDto.name,
        });
        const tokens = await this.generateTokens({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            tokens,
        };
    }
    async refreshToken(refreshTokenDto) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const tokens = await this.generateTokens({
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
            });
            return tokens;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async generateTokens(payload) {
        const jwtExpiresIn = (this.configService.get('JWT_EXPIRES_IN') ||
            '1d');
        const jwtRefreshExpiresIn = (this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d');
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ ...payload }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: jwtExpiresIn,
            }),
            this.jwtService.signAsync({ ...payload }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: jwtRefreshExpiresIn,
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async logout() {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { message: 'Logged out successfully' };
    }
    async firebaseLogin(firebaseLoginDto) {
        const firebaseUser = await this.firebaseAuthService.verifyIdToken(firebaseLoginDto.idToken);
        const user = await this.findOrCreateFirebaseUser(firebaseUser);
        const tokens = await this.generateTokens({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user,
            tokens,
        };
    }
    async findOrCreateFirebaseUser(firebaseUser) {
        let user = await this.usersService.findByFirebaseUid(firebaseUser.uid);
        if (user) {
            return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
            };
        }
        if (firebaseUser.email) {
            const existingUser = await this.usersService.findByEmail(firebaseUser.email);
            if (existingUser) {
                user = await this.usersService.linkFirebaseUid(existingUser._id.toString(), firebaseUser.uid);
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            }
        }
        const newUser = await this.usersService.createFromFirebase({
            email: firebaseUser.email || `${firebaseUser.uid}@firebase.local`,
            name: firebaseUser.name || 'Firebase User',
            firebaseUid: firebaseUser.uid,
            avatar: firebaseUser.picture || undefined,
        });
        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        firebase_auth_service_js_1.FirebaseAuthService,
        users_service_js_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map