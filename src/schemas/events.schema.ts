import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { Document, mongo } from 'mongoose';

export type EventsDocument = Events & Document;

export class EventObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  booking?: boolean;

  @ApiPropertyOptional()
  price?: string;

  @ApiPropertyOptional()
  weekNumber?: number;

  static init({
    title,
    start,
    end,
    description,
    color,
    phone,
    booking,
    price,
    weekNumber,
  }: {
    title: string;
    start: string;
    end: string;
    description?: string;
    color?: string;
    phone: string;
    booking?: boolean;
    price?: string;
    weekNumber?: number;
  }): EventObject {
    const event = new EventObject();
    event.id = new mongo.ObjectId().toJSON();
    event.title = title;
    event.start = start;
    event.end = end;
    event.description = description;
    event.color = color;
    event.phone = phone;
    event.booking = booking;
    event.price = price;
    event.weekNumber = weekNumber;
    return event;
  }
}

export type EventsByYear = {
  [key: string]:
    | {
        [key: string]: EventObject[] | null | undefined;
      }
    | undefined
    | null;
};

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class Events {
  @ApiProperty({
    default: {},
    nullable: true,
    additionalProperties: {
      type: 'object',
      nullable: true,
      additionalProperties: {
        type: 'array',
        nullable: true,
        items: {
          $ref: getSchemaPath(EventObject),
        },
      },
    },
  })
  @Prop({ required: true, type: 'object', default: {} })
  data: EventsByYear;

  @ApiProperty()
  @Prop({ required: true })
  userId: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  apartmentId: string;
}

export const EventsSchema = SchemaFactory.createForClass(Events);
