import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SwapPlayersDto {
  @ApiProperty({ 
    description: 'Player ID from Team A',
    example: '65a1b2c3d4e5f6g7h8i9j0k3'
  })
  @IsMongoId()
  playerAId: string; // Player từ team A

  @ApiProperty({ 
    description: 'Player ID from Team B',
    example: '65a1b2c3d4e5f6g7h8i9j0k4'
  })
  @IsMongoId()
  playerBId: string; // Player từ team B
}

export class SwapPlayersResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;

  @ApiProperty({ 
    description: 'Team A information after swap',
    example: {
      players: ['65a1b2c3...', '65a1b2c3...'],
      totalSkillLevel: 45
    }
  })
  teamA: {
    players: string[];
    totalSkillLevel: number;
  };

  @ApiProperty({ 
    description: 'Team B information after swap',
    example: {
      players: ['65a1b2c3...', '65a1b2c3...'],
      totalSkillLevel: 43
    }
  })
  teamB: {
    players: string[];
    totalSkillLevel: number;
  };
}
