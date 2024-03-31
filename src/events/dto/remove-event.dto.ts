import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RemoveEventDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  booking?: boolean;

  @ApiPropertyOptional()
  price?: string;

  @ApiPropertyOptional()
  weekNumber?: number;
}
