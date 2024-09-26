import { ApiProperty } from '@nestjs/swagger';
import { EventObject } from 'src/schemas/events.schema';

export class UpdateEventDto {
  @ApiProperty()
  updatedEvent: EventObject;

  @ApiProperty()
  oldEvent: EventObject;
}
