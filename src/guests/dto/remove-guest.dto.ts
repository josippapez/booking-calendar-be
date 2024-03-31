import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RemoveGuestDto {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  PID?: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiPropertyOptional()
  numberOfInvoice?: number;

  @ApiProperty()
  travelidNumber: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  dateOfArrival: string;

  @ApiProperty()
  dateOfDeparture: string;

  @ApiProperty()
  dateOfBirth: string;
}
