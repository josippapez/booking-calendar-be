import { ApiPropertyOptional } from '@nestjs/swagger';

export class EventsFiltersDto {
  @ApiPropertyOptional()
  year?: string;

  @ApiPropertyOptional()
  month?: string;
}
