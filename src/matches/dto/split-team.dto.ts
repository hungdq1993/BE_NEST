import { IsArray, IsMongoId, ArrayMinSize } from 'class-validator';

export class SplitTeamDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(2)
  playerIds: string[];
}
