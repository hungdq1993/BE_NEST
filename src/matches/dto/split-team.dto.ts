import { IsArray, IsMongoId, ArrayMinSize, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class SplitTeamDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(2)
  playerIds: string[];

  // Smart balancing options
  @IsOptional()
  @IsBoolean()
  useHistory?: boolean; // Use match history for balancing (default: false)

  @IsOptional()
  @IsBoolean()
  avoidFrequentTeammates?: boolean; // Avoid putting frequent teammates together (default: false)

  @IsOptional()
  @IsBoolean()
  balancePositions?: boolean; // Balance by player positions (default: false)

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  maxSkillDifference?: number; // Max acceptable skill difference between teams (default: 10)

  // Legacy field - ignored but allowed for backward compatibility
  @IsOptional()
  @IsNumber()
  maxIterations?: number;
}
