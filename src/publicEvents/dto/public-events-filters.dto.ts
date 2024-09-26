import { ApiPropertyOptional } from '@nestjs/swagger';

export class PublicEventsFiltersDto {
  @ApiPropertyOptional()
  year?: string;

  @ApiPropertyOptional()
  month?: string;
}
