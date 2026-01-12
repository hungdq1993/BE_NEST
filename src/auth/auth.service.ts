import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { FirebaseLoginDto } from './dto/firebase-login.dto.js';
import {
  FirebaseAuthService,
  FirebaseUserInfo,
} from './providers/firebase-auth.service.js';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    return this.usersService.validateUser(email, password);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
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

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      const tokens = await this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    const jwtExpiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') ||
      '1d') as StringValue;
    const jwtRefreshExpiresIn = (this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
    ) || '7d') as StringValue;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: jwtExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: jwtRefreshExpiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: 'Logged out successfully' };
  }

  async firebaseLogin(
    firebaseLoginDto: FirebaseLoginDto,
  ): Promise<AuthResponse> {
    const firebaseUser = await this.firebaseAuthService.verifyIdToken(
      firebaseLoginDto.idToken,
    );
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

  private async findOrCreateFirebaseUser(
    firebaseUser: FirebaseUserInfo,
  ): Promise<{
    id: string;
    email: string;
    name: string;
    role: string;
  }> {
    // 1. Find user by firebaseUid
    let user = await this.usersService.findByFirebaseUid(firebaseUser.uid);

    if (user) {
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }

    // 2. Find by email and link firebaseUid
    if (firebaseUser.email) {
      const existingUser = await this.usersService.findByEmail(
        firebaseUser.email,
      );
      if (existingUser) {
        user = await this.usersService.linkFirebaseUid(
          existingUser._id.toString(),
          firebaseUser.uid,
        );
        return {
          id: user!._id.toString(),
          email: user!.email,
          name: user!.name,
          role: user!.role,
        };
      }
    }

    // 3. Create new user
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
}
