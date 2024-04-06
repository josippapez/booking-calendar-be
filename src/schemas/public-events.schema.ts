import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PublicEventDocument = PublicEvents & Document;

export class PublicEventObject {
  @ApiProperty()
  id: string;

  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;

  static init({
    id,
    start,
    end,
  }: {
    id: string;
    start: string;
    end: string;
  }): PublicEventObject {
    const dto = new PublicEventObject();
    dto.id = id;
    dto.start = start;
    dto.end = end;
    return dto;
  }
}

export type PublicEventsByYear = {
  [key: string]:
    | {
        [key: string]: PublicEventObject[] | null | undefined;
      }
    | undefined
    | null;
} | null;

@Schema({
  toJSON: {
    virtuals: true,
  },
  virtuals: 'id',
})
export class PublicEvents {
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
          $ref: getSchemaPath(PublicEventObject),
        },
      },
    },
  })
  @Prop({ required: true, type: 'object', default: {} })
  data: PublicEventsByYear;

  @ApiProperty()
  @Prop({ required: true })
  userId: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  apartmentId: string;

  static mapObjectToPublicEventObject(
    events: PublicEvents | null,
    month: string,
  ): PublicEvents {
    const prevMonth = (Number(month) - 1).toString().padStart(2, '0');
    const tempMonth = month.padStart(2, '0');
    const nextMonth = (Number(month) + 1).toString().padStart(2, '0');

    const data = events
      ? {
          ...Object.keys(events.data).reduce((acc, year) => {
            acc[year] = {
              ...Object.keys(events.data[year]).reduce((acc2, date) => {
                if (
                  date.startsWith(`${year}-${prevMonth}`) ||
                  date.startsWith(`${year}-${tempMonth}`) ||
                  date.startsWith(`${year}-${nextMonth}`)
                ) {
                  acc2[date] = events.data[year][date];
                }
                return acc2;
              }, {}),
            };
            return acc;
          }, {}),
        }
      : null;

    return {
      ...events,
      data,
    };
  }
}

export class PublicEventsResponse {
  @ApiProperty()
  apartmentEmail: string;

  @ApiProperty()
  apartmentName: string;

  @ApiProperty()
  apartmentLogo: string;

  @ApiProperty()
  events: PublicEvents;
}

export const PublicEventsSchema = SchemaFactory.createForClass(PublicEvents);
