import { IsArray, IsMongoId, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUpdateSkillLevelDto {
  @ApiProperty({
    description: 'Danh sách User IDs cần update',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  userIds: string[];

  @ApiProperty({
    description: 'Trình độ kỹ năng (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  skillLevel: number;
}
