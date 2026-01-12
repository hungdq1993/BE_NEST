import { AuthService, AuthResponse, AuthTokens } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { FirebaseLoginDto } from './dto/firebase-login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponse>;
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens>;
    logout(): Promise<{
        message: string;
    }>;
    firebaseLogin(firebaseLoginDto: FirebaseLoginDto): Promise<AuthResponse>;
}
