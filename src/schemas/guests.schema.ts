import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Document, mongo } from 'mongoose';

export type GuestDocument = Guests & Document;

export class GuestObject {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  PID?: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiPropertyOptional()
  numberOfInvoice?: number;

  @ApiProperty()
  travelIdNumber: string;

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

  static init(
    guestDto: Omit<GuestObject, 'id'> & {
      id?: string;
    },
  ) {
    const dto = new GuestObject();
    dto.id = guestDto.id || new mongo.ObjectId().toJSON();
    dto.PID = guestDto.PID;
    dto.name = guestDto.name;
    dto.note = guestDto.note;
    dto.numberOfInvoice = guestDto.numberOfInvoice;
    dto.travelIdNumber = guestDto.travelIdNumber;
    dto.address = guestDto.address;
    dto.city = guestDto.city;
    dto.country = guestDto.country;
    dto.dateOfArrival = guestDto.dateOfArrival;
    dto.dateOfDeparture = guestDto.dateOfDeparture;
    dto.dateOfBirth = guestDto.dateOfBirth;
    return dto;
  }
}

export class GuestsByYear {
  [key: string]:
    | {
        [key: string]: GuestObject[] | null | undefined;
      }
    | undefined
    | null;
}

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class Guests {
  @ApiProperty({
    default: {},
    nullable: true,
    type: 'object',
    additionalProperties: {
      type: 'object',
      nullable: true,
      additionalProperties: {
        type: 'array',
        nullable: true,
        items: {
          $ref: getSchemaPath(GuestObject),
        },
      },
    },
  })
  @Prop({ required: true, type: 'object', default: {} })
  data: GuestsByYear;

  @Prop({ required: true, unique: true })
  apartmentId: string;

  @Prop({ required: true })
  userId: string;
}

export const GuestSchema = SchemaFactory.createForClass(Guests);
