import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPlayerToLineupDto {
  @ApiProperty({
    description: 'Player ID cần thêm vào đội',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsString()
  playerId: string;

  @ApiProperty({
    description: 'Đội cần thêm vào (A hoặc B)',
    example: 'A',
    enum: ['A', 'B'],
  })
  @IsEnum(['A', 'B'])
  team: 'A' | 'B';
}

export class RemovePlayerFromLineupDto {
  @ApiProperty({
    description: 'Player ID cần xóa khỏi đội',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsString()
  playerId: string;
}

export class MovePlayerDto {
  @ApiProperty({
    description: 'Player ID cần di chuyển',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsString()
  playerId: string;

  @ApiProperty({
    description: 'Đội đích (A hoặc B)',
    example: 'B',
    enum: ['A', 'B'],
  })
  @IsEnum(['A', 'B'])
  toTeam: 'A' | 'B';
}
