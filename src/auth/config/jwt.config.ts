import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
        '4d') as StringValue,
    },
  }),
  inject: [ConfigService],
};
