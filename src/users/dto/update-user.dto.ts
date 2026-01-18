import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/decorators/roles.decorator.js';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email của user',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu mới (tối thiểu 6 ký tự)',
    example: 'newpassword123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: 'Tên user',
    example: 'Nguyễn Văn B',
  })
  @IsOptional()
  @IsString()
  name?: string;

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
    example: 7,
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
    example: 'https://example.com/new-avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Firebase UID',
    example: 'firebase-uid-456',
  })
  @IsOptional()
  @IsString()
  firebaseUid?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'User có phải sinh viên không',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isStudent?: boolean;
}
