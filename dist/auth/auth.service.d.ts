import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { FirebaseLoginDto } from './dto/firebase-login.dto.js';
import { FirebaseAuthService } from './providers/firebase-auth.service.js';
import { UsersService } from '../users/users.service.js';
import { UserDocument } from '../users/schemas/user.schema.js';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    tokens: AuthTokens;
}
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly firebaseAuthService;
    private readonly usersService;
    constructor(jwtService: JwtService, configService: ConfigService, firebaseAuthService: FirebaseAuthService, usersService: UsersService);
    validateUser(email: string, password: string): Promise<UserDocument | null>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens>;
    generateTokens(payload: JwtPayload): Promise<AuthTokens>;
    logout(): Promise<{
        message: string;
    }>;
    firebaseLogin(firebaseLoginDto: FirebaseLoginDto): Promise<AuthResponse>;
    private findOrCreateFirebaseUser;
}
