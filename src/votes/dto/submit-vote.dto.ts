import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { VoteChoice } from '../schemas/vote-response.schema.js';

export class SubmitVoteDto {
  @IsMongoId()
  @IsNotEmpty()
  sessionId: string;

  @IsEnum(VoteChoice)
  @IsNotEmpty()
  choice: VoteChoice;

  @IsString()
  @IsOptional()
  note?: string;
}
