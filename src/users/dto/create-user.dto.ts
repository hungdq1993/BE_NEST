import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/decorators/roles.decorator.js';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email của user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Tên user',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Vai trò',
    enum: Role,
    example: Role.PLAYER,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: 'Trình độ kỹ năng (1-10)',
    example: 5,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  skillLevel?: number;

  @ApiPropertyOptional({
    description: 'URL avatar',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Firebase UID',
    example: 'firebase-uid-123',
  })
  @IsOptional()
  @IsString()
  firebaseUid?: string;

  @ApiPropertyOptional({
    description: 'User có phải sinh viên không',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isStudent?: boolean;
}
