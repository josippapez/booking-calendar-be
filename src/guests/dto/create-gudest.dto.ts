import { OmitType } from '@nestjs/swagger';
import { GuestObject } from 'src/schemas/guests.schema';

export class CreateGuestDto extends OmitType(GuestObject, ['id']) {}
