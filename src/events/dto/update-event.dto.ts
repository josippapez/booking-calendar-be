import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEvent {
  @ApiProperty()
  id: string;

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

export class OldEvent {
  @ApiProperty()
  id: string;

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

export class UpdateEventDto {
  @ApiProperty()
  updatedEvent: UpdateEvent;

  @ApiProperty()
  oldEvent: OldEvent;
}
