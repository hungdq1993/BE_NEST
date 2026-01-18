import { IsArray, IsMongoId, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkMarkMonthlyFeePaidDto {
  @ApiProperty({
    description: 'Danh sách User IDs cần đánh dấu đã thanh toán',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  userIds: string[];

  @ApiPropertyOptional({
    description: 'Tháng cần thanh toán (nếu không truyền thì lấy tháng hiện tại)',
    example: 1,
    minimum: 1,
    maximum: 12,
  })
  @IsNumber()
  @Min(1)
  @Max(12)
  @IsOptional()
  month?: number;

  @ApiPropertyOptional({
    description: 'Năm cần thanh toán (nếu không truyền thì lấy năm hiện tại)',
    example: 2025,
    minimum: 2000,
    maximum: 2100,
  })
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  year?: number;
}
