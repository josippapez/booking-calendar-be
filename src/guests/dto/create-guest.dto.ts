import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OldGuestInfo {
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

class NewGuestInfo {
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

export class CreateGuestDto {
  @ApiProperty()
  newGuestInfo: NewGuestInfo;

  @ApiProperty()
  oldGuestInfo: OldGuestInfo;
}
