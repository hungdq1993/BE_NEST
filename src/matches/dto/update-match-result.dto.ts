import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MatchResultDto {
  @IsNumber()
  @Min(0)
  teamAScore: number;

  @IsNumber()
  @Min(0)
  teamBScore: number;
}

export class UpdateMatchResultDto {
  @ValidateNested()
  @Type(() => MatchResultDto)
  result: MatchResultDto;

  @IsString()
  @IsOptional()
  notes?: string;
}
