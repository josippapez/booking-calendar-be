import { ApiProperty } from '@nestjs/swagger';
import { GuestObject } from 'src/schemas/guests.schema';

export class UpdateGuestDto {
  @ApiProperty()
  newGuestInfo: GuestObject;

  @ApiProperty()
  oldGuestInfo: GuestObject;
}
