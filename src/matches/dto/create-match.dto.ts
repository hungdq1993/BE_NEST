import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId,
  Min,
} from 'class-validator';

export class CreateMatchDto {
  @IsDateString()
  @IsNotEmpty()
  matchDate: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsMongoId()
  @IsOptional()
  voteSessionId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  matchFee?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
