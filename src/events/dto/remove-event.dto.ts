import { ApiProperty } from '@nestjs/swagger';

export class RemoveEventDto {
  @ApiProperty()
  id: string;
}
