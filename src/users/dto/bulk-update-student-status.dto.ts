import { IsArray, IsBoolean, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUpdateStudentStatusDto {
  @ApiProperty({
    description: 'Danh sách User IDs cần update',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  userIds: string[];

  @ApiProperty({
    description: 'Trạng thái sinh viên (true = sinh viên, false = người thường)',
    example: true,
  })
  @IsBoolean()
  isStudent: boolean;
}
