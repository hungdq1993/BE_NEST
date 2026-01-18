import { IsArray, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BulkMarkMatchPaymentPaidDto {
  @ApiProperty({
    description: 'Danh sách User IDs cần đánh dấu đã thanh toán',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  userIds: string[];

  @ApiPropertyOptional({
    description: 'Match ID (nếu muốn thanh toán cho 1 trận cụ thể, nếu không truyền thì thanh toán tất cả các trận chưa đóng)',
    example: '507f1f77bcf86cd799439013',
  })
  @IsMongoId()
  @IsOptional()
  matchId?: string;
}
