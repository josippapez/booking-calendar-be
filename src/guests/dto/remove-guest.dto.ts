import { ApiProperty } from '@nestjs/swagger';

export class RemoveGuestDto {
  @ApiProperty()
  guestId: string;

  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;
}
