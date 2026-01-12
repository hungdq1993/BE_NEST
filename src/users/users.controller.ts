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
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto, UserWithStatsResponseDto } from './dto/user-response.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles, Role } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CAPTAIN)
  async findAll(
    @Query('withStats') withStats?: string,
  ): Promise<UserResponseDto[] | UserWithStatsResponseDto[]> {
    if (withStats === 'true') {
      return this.usersService.findAllWithStats();
    }
    return this.usersService.findAll();
  }

  @Get('me')
  async getProfile(
    @CurrentUser() user: { sub: string },
  ): Promise<UserResponseDto> {
    return this.usersService.findById(user.sub);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CAPTAIN)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
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

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
