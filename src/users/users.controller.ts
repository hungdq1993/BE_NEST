import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { BulkUpdateStudentStatusDto } from './dto/bulk-update-student-status.dto.js';
import { BulkUpdateSkillLevelDto } from './dto/bulk-update-skill-level.dto.js';
import { UserResponseDto, UserWithStatsResponseDto } from './dto/user-response.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, Role } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== PUBLIC VIEW APIs ====================

  @Public()
  @Get()
  async findAll(
    @Query('withStats') withStats?: string,
  ): Promise<UserResponseDto[] | UserWithStatsResponseDto[]> {
    if (withStats === 'true') {
      return this.usersService.findAllWithStats();
    }
    return this.usersService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  // ==================== AUTHENTICATED USER APIs ====================

  @Get('me')
  async getProfile(
    @CurrentUser() user: { sub: string },
  ): Promise<UserResponseDto> {
    return this.usersService.findById(user.sub);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: { sub: string },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Users can only update their own profile (limited fields)
    const { ...allowedUpdates } = updateUserDto;
    return this.usersService.update(user.sub, allowedUpdates as UpdateUserDto);
  }

  // ==================== ADMIN ONLY APIs ====================

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }

  @Patch('bulk/student-status')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật hàng loạt trạng thái sinh viên' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    schema: {
      example: {
        updated: 2,
        users: [
          {
            id: '507f1f77bcf86cd799439011',
            email: 'user1@example.com',
            name: 'Nguyễn Văn A',
            role: 'PLAYER',
            skillLevel: 5,
            isActive: true,
            isStudent: true,
            createdAt: '2025-01-16T10:00:00.000Z',
            updatedAt: '2025-01-16T10:30:00.000Z',
          },
        ],
      },
    },
  })
  async bulkUpdateStudentStatus(
    @Body() dto: BulkUpdateStudentStatusDto,
  ): Promise<{ updated: number; users: UserResponseDto[] }> {
    return this.usersService.bulkUpdateStudentStatus(dto.userIds, dto.isStudent);
  }

  @Patch('bulk/skill-level')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật hàng loạt trình độ kỹ năng' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    schema: {
      example: {
        updated: 2,
        users: [
          {
            id: '507f1f77bcf86cd799439011',
            email: 'user1@example.com',
            name: 'Nguyễn Văn A',
            role: 'PLAYER',
            skillLevel: 7,
            isActive: true,
            isStudent: false,
            createdAt: '2025-01-16T10:00:00.000Z',
            updatedAt: '2025-01-16T10:30:00.000Z',
          },
        ],
      },
    },
  })
  async bulkUpdateSkillLevel(
    @Body() dto: BulkUpdateSkillLevelDto,
  ): Promise<{ updated: number; users: UserResponseDto[] }> {
    return this.usersService.bulkUpdateSkillLevel(dto.userIds, dto.skillLevel);
  }
}
